import {
  debounce,
  email,
  minLength,
  required,
  SchemaPath,
} from "@angular/forms/signals";

export const MIN_PASSWORD_LENGTH = 6;

/**
 * The email and password rules shared by the login and register forms, so
 * both screens validate and word their errors the same way.
 */
export function applyCredentialRules(
  emailPath: SchemaPath<string>,
  passwordPath: SchemaPath<string>,
) {
  debounce(emailPath, 500);
  required(emailPath, { message: "Email is required" });
  email(emailPath, { message: "Please enter a valid email" });
  required(passwordPath, { message: "Password is required" });
  minLength(passwordPath, MIN_PASSWORD_LENGTH, {
    message: `Password minimum of ${MIN_PASSWORD_LENGTH} characters`,
  });
}
