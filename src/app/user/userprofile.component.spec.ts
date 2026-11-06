import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/angular";
import { UserprofileComponent } from "./userprofile.component";
import {
  AuthService,
  WrongPasswordError,
} from "../core/auth/services/auth.service";

const passwordUser = {
  displayName: "Player One",
  email: "player@example.com",
};

async function setup(
  user: any = passwordUser,
  { password = true }: { password?: boolean } = {},
) {
  const authService = {
    user: signal(user),
    hasPasswordProvider: signal(password),
    updateDisplayName: vi.fn().mockResolvedValue(undefined),
    changePassword: vi.fn().mockResolvedValue(undefined),
  };
  const view = await render(UserprofileComponent, {
    providers: [{ provide: AuthService, useValue: authService }],
  });
  return { authService, ...view };
}

const nameInput = () => screen.getByLabelText("Name") as HTMLInputElement;
const type = (el: HTMLElement, value: string) => {
  fireEvent.input(el, { target: { value } });
  fireEvent.blur(el);
};
const saveName = () => screen.getByRole("button", { name: "Save name" }) as HTMLButtonElement;
const savePassword = () =>
  screen.getByRole("button", { name: "Change password" }) as HTMLButtonElement;

describe("UserprofileComponent", () => {
  beforeEach(() => TestBed.resetTestingModule());

  describe("account details and display name", () => {
    it("shows the name and the email", async () => {
      await setup();
      expect(nameInput().value).toBe("Player One");
      expect(screen.getByText("player@example.com")).toBeTruthy();
    });

    it("shows an empty name field and no 'undefined' when there is no display name", async () => {
      const { container } = await setup({ displayName: null, email: "p@example.com" });
      expect(nameInput().value).toBe("");
      expect(container.textContent).not.toContain("undefined");
    });

    it("shows 'Name is required' and disables save for an empty name", async () => {
      await setup();
      type(nameInput(), "");
      expect(await screen.findByText("Name is required")).toBeTruthy();
      expect(nameInput().getAttribute("aria-invalid")).toBe("true");
      expect(saveName().disabled).toBe(true);
    });

    it("saves the name and confirms", async () => {
      const { authService } = await setup();
      type(nameInput(), "Dino Fan");
      saveName().click();

      expect(await screen.findByText("Your name has been saved.")).toBeTruthy();
      expect(authService.updateDisplayName).toHaveBeenCalledWith("Dino Fan");
      expect(nameInput().value).toBe("Dino Fan");
    });

    it("shows a failure message and keeps the entered name when saving fails", async () => {
      const { authService } = await setup();
      authService.updateDisplayName.mockRejectedValue(new Error("offline"));
      type(nameInput(), "Dino Fan");
      saveName().click();

      expect(
        await screen.findByText("Could not save your name. Please try again."),
      ).toBeTruthy();
      expect(nameInput().value).toBe("Dino Fan");
    });
  });

  describe("password", () => {
    it("is hidden for an account without a password", async () => {
      await setup(passwordUser, { password: false });
      expect(screen.queryByLabelText("Current password")).toBeNull();
      expect(screen.queryByLabelText("New password")).toBeNull();
      expect(nameInput()).toBeTruthy();
    });

    it("is shown for a password account", async () => {
      await setup();
      expect(screen.getByLabelText("Current password")).toBeTruthy();
      expect(screen.getByLabelText("New password")).toBeTruthy();
    });

    it("blocks a too short new password with the shared message", async () => {
      await setup();
      type(screen.getByLabelText("Current password"), "old-pass");
      type(screen.getByLabelText("New password"), "abc");

      expect(await screen.findByText("Password minimum of 6 characters")).toBeTruthy();
      expect(savePassword().disabled).toBe(true);
    });

    it("changes the password, confirms and clears the fields", async () => {
      const { authService } = await setup();
      type(screen.getByLabelText("Current password"), "old-pass");
      type(screen.getByLabelText("New password"), "new-pass");
      savePassword().click();

      expect(await screen.findByText("Your password has been changed.")).toBeTruthy();
      expect(authService.changePassword).toHaveBeenCalledWith("old-pass", "new-pass");
      expect((screen.getByLabelText("Current password") as HTMLInputElement).value).toBe("");
      expect((screen.getByLabelText("New password") as HTMLInputElement).value).toBe("");
    });

    it("shows the wrong-password message", async () => {
      const { authService } = await setup();
      authService.changePassword.mockRejectedValue(new WrongPasswordError());
      type(screen.getByLabelText("Current password"), "nope-nope");
      type(screen.getByLabelText("New password"), "new-pass");
      savePassword().click();

      expect(await screen.findByText("Your current password is incorrect.")).toBeTruthy();
    });

    it("shows the generic message for any other failure", async () => {
      const { authService } = await setup();
      authService.changePassword.mockRejectedValue(new Error("offline"));
      type(screen.getByLabelText("Current password"), "old-pass");
      type(screen.getByLabelText("New password"), "new-pass");
      savePassword().click();

      expect(
        await screen.findByText("Could not change your password. Please try again."),
      ).toBeTruthy();
    });
  });
});
