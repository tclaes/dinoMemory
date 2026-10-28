import { describe, expect, it, vi } from "vitest";

import { LoginComponent } from "./login.component";
import { fireEvent, render, screen } from "@testing-library/angular";
import { AuthService } from "../../../core/auth/services/auth.service";

describe("LoginComponent", () => {
  it("should create", () => {
    render(LoginComponent, {
      providers: [{ provide: AuthService, useValue: {} }],
    });
  });

  it("is invalid when the form is empty", async () => {
    const { fixture } = await render(LoginComponent, {
      providers: [{ provide: AuthService, useValue: {} }],
    });

    const { loginForm } = fixture.componentInstance;
    expect(loginForm().invalid()).toBeTruthy();
  });

  it("flags a malformed email address", async () => {
    const { fixture } = await render(LoginComponent, {
      providers: [{ provide: AuthService, useValue: {} }],
    });

    const { loginForm } = fixture.componentInstance;
    loginForm.email().value.set("dino");

    expect(loginForm.email().errors()[0].message).toEqual(
      "Please enter a valid email",
    );
  });

  it("is valid with a proper email and a password of at least 6 characters", async () => {
    const { fixture } = await render(LoginComponent, {
      providers: [{ provide: AuthService, useValue: {} }],
    });

    const { loginForm } = fixture.componentInstance;
    loginForm.email().value.set("dino@test.com");
    loginForm.password().value.set("dino123");

    expect(loginForm().invalid()).toBeFalsy();
  });

  it("Sign in button delegates to AuthService with the raw form values", async () => {
    const signInWithEmailAndPassword = vi.fn();
    const { fixture } = await render(LoginComponent, {
      providers: [
        {
          provide: AuthService,
          useValue: {
            signInWithEmailAndPassword,
          },
        },
      ],
    });

    const { loginForm } = fixture.componentInstance;
    loginForm.email().value.set("dino@test.com");
    loginForm.password().value.set("dino123");
    await fixture.whenStable();

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith({
      email: "dino@test.com",
      password: "dino123",
    });
  });

  it("loginWithGoogle() delegates to AuthService", async () => {
    const loginWithGoogle = vi.fn();
    await render(LoginComponent, {
      providers: [
        {
          provide: AuthService,
          useValue: {
            loginWithGoogle,
          },
        },
      ],
    });

    screen.getByRole("button", { name: "Login with Google" }).click();

    expect(loginWithGoogle).toHaveBeenCalledTimes(1);
  });
});
