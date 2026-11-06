import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from "@angular/core";
import { form, FormField, required } from "@angular/forms/signals";
import {
  AuthService,
  WrongPasswordError,
} from "../core/auth/services/auth.service";
import { applyPasswordRules } from "./auth-schema";

@Component({
  selector: "app-user",
  templateUrl: "./userprofile.component.html",
  styleUrls: ["./userprofile.component.scss"],
  imports: [FormField],
})
export class UserprofileComponent {
  private authService = inject(AuthService);

  email = computed(() => this.authService.user()?.email ?? "");
  hasPassword = computed(() => this.authService.hasPasswordProvider());

  nameModel = signal({ name: "" });
  nameForm = form(this.nameModel, (path) => {
    required(path.name, { message: "Name is required" });
  });
  nameSaving = signal(false);
  nameSuccess = signal("");
  nameError = signal("");

  passwordModel = signal({ currentPassword: "", newPassword: "" });
  passwordForm = form(this.passwordModel, (path) => {
    required(path.currentPassword, { message: "Current password is required" });
    applyPasswordRules(path.newPassword);
  });
  passwordSaving = signal(false);
  passwordSuccess = signal("");
  passwordError = signal("");

  constructor() {
    // Fill the name field once from the signed-in user. Later edits and saves
    // are kept locally, because Firebase mutates the user in place and the
    // `user` signal does not re-emit after updateProfile.
    let initialised = false;
    effect(() => {
      const user = this.authService.user();
      if (user && !initialised) {
        initialised = true;
        untracked(() =>
          this.nameModel.set({ name: user.displayName ?? "" }),
        );
      }
    });
  }

  async saveName() {
    if (this.nameForm().invalid() || this.nameSaving()) {
      return;
    }
    this.nameSuccess.set("");
    this.nameError.set("");
    this.nameSaving.set(true);
    try {
      await this.authService.updateDisplayName(this.nameForm.name().value());
      this.nameSuccess.set("Your name has been saved.");
    } catch {
      this.nameError.set("Could not save your name. Please try again.");
    } finally {
      this.nameSaving.set(false);
    }
  }

  async savePassword() {
    if (this.passwordForm().invalid() || this.passwordSaving()) {
      return;
    }
    const { currentPassword, newPassword } = this.passwordForm().value();
    this.passwordSuccess.set("");
    this.passwordError.set("");
    this.passwordSaving.set(true);
    try {
      await this.authService.changePassword(currentPassword, newPassword);
      this.passwordModel.set({ currentPassword: "", newPassword: "" });
      this.passwordForm().reset();
      this.passwordSuccess.set("Your password has been changed.");
    } catch (err) {
      this.passwordError.set(
        err instanceof WrongPasswordError
          ? "Your current password is incorrect."
          : "Could not change your password. Please try again.",
      );
    } finally {
      this.passwordSaving.set(false);
    }
  }
}
