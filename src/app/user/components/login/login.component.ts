import { Component, computed, inject, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { form, FormField } from "@angular/forms/signals";
import { AuthService } from "../../../core/auth/services/auth.service";
import { applyCredentialRules } from "../../auth-schema";

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  imports: [ReactiveFormsModule, RouterLink, FormField],
})
export class LoginComponent {
  loginModel = signal<LoginData>({
    email: "",
    password: "",
  });
  loginForm = form(this.loginModel, (schemaPath) => {
    applyCredentialRules(schemaPath.email, schemaPath.password);
  });
  isFormValid = computed(() => this.loginForm().valid());
  #authService = inject(AuthService);

  loginError = signal("");

  async loginWithGoogle() {
    this.loginError.set("");
    try {
      await this.#authService.loginWithGoogle();
    } catch {
      this.loginError.set("Login with Google failed. Please try again.");
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.loginError.set("");
    try {
      await this.#authService.signInWithEmailAndPassword(
        this.loginForm().value(),
      );
    } catch {
      this.loginError.set("Sign in failed. Check your email and password.");
    }
  }
}
