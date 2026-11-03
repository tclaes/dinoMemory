import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/auth/services/auth.service";
import { User } from "../../model/user";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, RouterLink],
})
export class RegisterComponent {
  registerForm = new UntypedFormGroup({
    name: new UntypedFormControl("", Validators.required),
    email: new UntypedFormControl("", [Validators.required, Validators.email]),
    password: new UntypedFormControl("", [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  private authService = inject(AuthService);

  get f() {
    return this.registerForm.controls;
  }

  registerError = signal("");
  submitting = signal(false);

  async register() {
    if (this.registerForm.invalid || this.submitting()) {
      return;
    }
    const user: User = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

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
