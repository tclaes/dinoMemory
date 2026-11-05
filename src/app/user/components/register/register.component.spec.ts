import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideRouter } from "@angular/router";

import { RegisterComponent } from "./register.component";
import { AuthService } from "../../../core/auth/services/auth.service";
import { createSpyObj, SpyObj } from "../../../../testing/spy";
import { beforeEach, describe, expect, it } from "vitest";

describe("RegisterComponent", () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authSpy: SpyObj<AuthService>;

  beforeEach(() => {
    authSpy = createSpyObj("AuthService", ["tryRegister"]);

    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authSpy },
        // The template's routerLink needs a router.
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  const fill = (values: { name?: string; email?: string; password?: string }) => {
    const { registerForm } = component;
    if (values.name !== undefined) registerForm.name().value.set(values.name);
    if (values.email !== undefined) registerForm.email().value.set(values.email);
    if (values.password !== undefined) registerForm.password().value.set(values.password);
    fixture.detectChanges(false);
  };

  it("is invalid when the form is empty", () => {
    const { registerForm } = component;
    expect(registerForm().invalid()).toBe(true);
    expect(registerForm.name().errors()[0].message).toBe("Name is required");
    expect(registerForm.email().errors()[0].message).toBe("Email is required");
    expect(registerForm.password().errors()[0].message).toBe("Password is required");
  });

  it("uses the same messages as the login form for a malformed email and a short password", () => {
    fill({ email: "not-an-email", password: "abc" });

    expect(component.registerForm.email().errors()[0].message).toBe(
      "Please enter a valid email",
    );
    expect(component.registerForm.password().errors()[0].message).toBe(
      "Password minimum of 6 characters",
    );
  });

  it("is valid with a name, a proper email and a password of at least 6 characters", () => {
    fill({ name: "Player One", email: "player@example.com", password: "secret1" });

    expect(component.registerForm().valid()).toBe(true);
  });

  it("marks a touched invalid field and links it to its error message", () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector("#register-email");
    expect(input.getAttribute("aria-invalid")).toBe("false");
    expect(input.getAttribute("aria-describedby")).toBeNull();

    fill({ email: "not-an-email" });
    input.dispatchEvent(new Event("blur"));
    fixture.detectChanges(false);

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("register-email-error");
    const error = fixture.nativeElement.querySelector("#register-email-error");
    expect(error.getAttribute("role")).toBe("alert");
    expect(error.textContent.trim()).toBe("Please enter a valid email");
  });

  it("labels every field so it can be found by its label text", () => {
    for (const key of ["name", "email", "password"]) {
      const label = fixture.nativeElement.querySelector(`label[for="register-${key}"]`);
      expect(label).toBeTruthy();
      expect(fixture.nativeElement.querySelector(`#register-${key}`)).toBeTruthy();
    }
  });

  it("register() delegates to AuthService.tryRegister with the form values", async () => {
    fill({ name: "Player One", email: "player@example.com", password: "secret1" });

    await component.register();

    expect(authSpy.tryRegister).toHaveBeenCalledWith({
      name: "Player One",
      email: "player@example.com",
      password: "secret1",
    });
  });

  it("does not call AuthService.tryRegister while the form is invalid", async () => {
    fill({ name: "Player One", email: "nope", password: "secret1" });

    await component.register();

    expect(authSpy.tryRegister).not.toHaveBeenCalled();
  });

  it("submits the email that was just typed, even before the input debounce has applied it", async () => {
    fill({ name: "Player One", email: "old@example.com", password: "secret1" });
    const input: HTMLInputElement = fixture.nativeElement.querySelector("#register-email");

    // Typing goes through the 500 ms debounce, so the model still holds the old address.
    input.value = "new@example.com";
    input.dispatchEvent(new Event("input"));
    expect(component.registerForm.email().value()).toBe("old@example.com");

    await component.register();

    expect(authSpy.tryRegister).toHaveBeenCalledWith({
      name: "Player One",
      email: "new@example.com",
      password: "secret1",
    });
  });

  describe("submitting", () => {
    const fillValidForm = () => {
      fill({ name: "Player One", email: "player@example.com", password: "secret1" });
    };
    const errorText = () =>
      fixture.nativeElement.querySelector("#register-error")?.textContent?.trim();
    const button = () =>
      fixture.nativeElement.querySelector("button[type=submit]") as HTMLButtonElement;

    it("shows no error after a successful registration", async () => {
      authSpy.tryRegister.mockResolvedValue(undefined);
      fillValidForm();

      await component.register();
      fixture.detectChanges();

      expect(errorText()).toBeUndefined();
    });

    it.each([
      ["auth/email-already-in-use", "This email is already in use."],
      ["auth/weak-password", "This password is too weak. Use at least 6 characters."],
      ["auth/network-request-failed", "Registration failed. Please try again."],
    ])("shows a message for %s and enables the button again", async (code, message) => {
      authSpy.tryRegister.mockRejectedValue(Object.assign(new Error("x"), { code }));
      fillValidForm();

      await component.register();
      fixture.detectChanges();

      expect(errorText()).toBe(message);
      expect(button().disabled).toBe(false);
    });

    it("disables the button and ignores a second submit while in flight", async () => {
      let finish!: () => void;
      authSpy.tryRegister.mockReturnValue(new Promise<void>((r) => (finish = r)));
      fillValidForm();

      const first = component.register();
      void component.register();
      fixture.detectChanges();

      expect(button().disabled).toBe(true);
      expect(authSpy.tryRegister).toHaveBeenCalledTimes(1);

      finish();
      await first;
      fixture.detectChanges();
      expect(button().disabled).toBe(false);
    });

    it("clears a previous error when submitting again", async () => {
      authSpy.tryRegister.mockRejectedValueOnce(new Error("x"));
      fillValidForm();
      await component.register();

      authSpy.tryRegister.mockResolvedValue(undefined);
      await component.register();
      fixture.detectChanges();

      expect(errorText()).toBeUndefined();
    });
  });
});
