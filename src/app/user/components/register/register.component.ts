import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { form, FormField, required } from "@angular/forms/signals";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/auth/services/auth.service";
import { applyCredentialRules } from "../../auth-schema";
import { User } from "../../model/user";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink, FormField],
})
export class RegisterComponent {
  registerModel = signal<RegisterData>({ name: "", email: "", password: "" });
  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.name, { message: "Name is required" });
    applyCredentialRules(schemaPath.email, schemaPath.password);
  });
  isFormValid = computed(() => this.registerForm().valid());

  private authService = inject(AuthService);

  registerError = signal("");
  submitting = signal(false);

  async register() {
    // Applies an email edit that is still waiting on the input debounce.
    this.registerForm.email().markAsTouched();
    if (!this.isFormValid() || this.submitting()) {
      return;
    }
    const { name, email, password } = this.registerForm().value();
    const user: User = { name, email, password };

    this.registerError.set("");
    this.submitting.set(true);
    try {
      await this.authService.tryRegister(user);
    } catch (err) {
      this.registerError.set(this.messageFor(err));
    } finally {
      this.submitting.set(false);
    }
  }

  private messageFor(err: unknown): string {
    switch ((err as { code?: string })?.code) {
      case "auth/email-already-in-use":
        return "This email is already in use.";
      case "auth/weak-password":
        return "This password is too weak. Use at least 6 characters.";
      default:
        return "Registration failed. Please try again.";
    }
  }
}
