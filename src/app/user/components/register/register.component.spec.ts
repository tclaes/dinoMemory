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

  it("is invalid when the form is empty", () => {
    expect(component.registerForm.valid).toBe(false);
    expect(component.f.name.errors.required).toBeTruthy();
    expect(component.f.email.errors.required).toBeTruthy();
    expect(component.f.password.errors.required).toBeTruthy();
  });

  it("flags a malformed email address and a too-short password", () => {
    component.registerForm.controls.email.setValue("not-an-email");
    component.registerForm.controls.password.setValue("abc");
    fixture.detectChanges(false);

    expect(component.f.email.errors.email).toBeTruthy();
    expect(component.f.password.errors.minlength).toBeTruthy();
  });

  it("is valid with a name, a proper email and a password of at least 6 characters", () => {
    component.registerForm.controls.name.setValue("Player One");
    component.registerForm.controls.email.setValue("player@example.com");
    component.registerForm.controls.password.setValue("secret1");
    fixture.detectChanges(false);

    expect(component.registerForm.valid).toBe(true);
  });

  it("register() delegates to AuthService.tryRegister with the raw form values", async () => {
    component.registerForm.controls.name.setValue("Player One");
    component.registerForm.controls.email.setValue("player@example.com");
    component.registerForm.controls.password.setValue("secret1");
    fixture.detectChanges(false);

    await component.register();

    expect(authSpy.tryRegister).toHaveBeenCalledWith({
      name: "Player One",
      email: "player@example.com",
      password: "secret1",
    });
  });

  describe("submitting", () => {
    const fillValidForm = () => {
      component.registerForm.setValue({
        name: "Player One",
        email: "player@example.com",
        password: "secret1",
      });
      fixture.detectChanges(false);
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
