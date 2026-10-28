import { Component, computed, inject, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import {
  debounce,
  email,
  form,
  FormField,
  minLength,
  required,
} from "@angular/forms/signals";
import { AuthService } from "../../../core/auth/services/auth.service";

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
    debounce(schemaPath.email, 500);
    required(schemaPath.email, { message: "Email is required" });
    email(schemaPath.email, { message: "Please enter a valid email" });
    required(schemaPath.password, { message: "Password is required" });
    minLength(schemaPath.password, 6, {
      message: "Password minimum of 6 characters",
    });
  });
  isFormValid = computed(() => {
    return Object.values(this.loginForm).every(
      (control) => control.valid?.() ?? true,
    );
  });
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
