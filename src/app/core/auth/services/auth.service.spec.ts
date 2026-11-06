import { TestBed } from "@angular/core/testing";
import { Auth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AuthService, WrongPasswordError } from "./auth.service";
import { AUTH_OPS } from "../auth-ops";
import {
  createMockAuthOps,
  mockSignedInUser,
  mockUser,
} from "../../../../testing/firebase-mocks";
import { createSpyObj, SpyObj } from "../../../../testing/spy";
import { beforeEach, describe, expect, it } from "vitest";

describe("AuthService", () => {
  let service: AuthService;
  let authOps: SpyObj<any>;
  let userSubject: { next(user: any): void };
  let routerSpy: SpyObj<Router>;
  const fakeAuth = {};

  beforeEach(() => {
    const mocks = createMockAuthOps();
    authOps = mocks.ops;
    userSubject = mocks.userSubject;
    routerSpy = createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: fakeAuth },
        { provide: AUTH_OPS, useValue: authOps },
        { provide: Router, useValue: routerSpy },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("picks up the current auth state on construction", () => {
    expect(service.user()).toEqual(mockUser);
  });

  it("should call ops sign in with email and password", () => {
    service.signInWithEmailAndPassword({
      email: "test@test.com",
      password: "test123",
    });
    expect(authOps.signInWithEmailAndPassword).toHaveBeenCalledWith(
      fakeAuth,
      "test@test.com",
      "test123",
    );
  });

  it("should update auth state after login with email and password", async () => {
    await service.signInWithEmailAndPassword({
      email: "test@test.com",
      password: "test123",
    });

    expect(service.user()).toEqual({
      ...mockSignedInUser,
      email: "test@test.com",
    });
  });

  it("does not navigate until sign in has resolved", async () => {
    let finishSignIn!: () => void;
    authOps.signInWithEmailAndPassword.mockReturnValue(
      new Promise<void>((resolve) => (finishSignIn = resolve)),
    );

    const login = service.signInWithEmailAndPassword({
      email: "test@test.com",
      password: "test123",
    });
    await Promise.resolve();
    expect(routerSpy.navigate).not.toHaveBeenCalled();

    finishSignIn();
    await login;
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/"]);
  });

  it("does not navigate when sign in fails", async () => {
    authOps.signInWithEmailAndPassword.mockRejectedValue(new Error("nope"));

    await expect(
      service.signInWithEmailAndPassword({
        email: "test@test.com",
        password: "wrong",
      }),
    ).rejects.toThrow("nope");
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it("navigates after the Google popup has resolved", async () => {
    let closePopup!: () => void;
    authOps.signInWithPopup.mockReturnValue(
      new Promise<void>((resolve) => (closePopup = resolve)),
    );

    const login = service.loginWithGoogle();
    await Promise.resolve();
    expect(routerSpy.navigate).not.toHaveBeenCalled();

    closePopup();
    await login;
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/"]);
  });

  it("does not navigate when the Google popup is rejected", async () => {
    authOps.signInWithPopup.mockRejectedValue(new Error("closed"));

    await expect(service.loginWithGoogle()).rejects.toThrow("closed");
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it("should navigate to homepage after successful login", async () => {
    await service.signInWithEmailAndPassword({
      email: "test@test.com",
      password: "test123",
    });

    expect(routerSpy.navigate).toHaveBeenCalledWith(["/"]);
  });

  describe("tryRegister", () => {
    const newUser = {
      name: "Player One",
      email: "new@test.com",
      password: "secret123",
    };
    const created = { uid: "new-uid" };

    beforeEach(() => {
      authOps.createUserWithEmailAndPassword.mockResolvedValue({
        user: created,
      });
      authOps.updateProfile.mockResolvedValue(undefined);
    });

    it("creates the account, sets the display name and then navigates home", async () => {
      const calls: string[] = [];
      authOps.createUserWithEmailAndPassword.mockImplementation(async () => {
        calls.push("create");
        return { user: created };
      });
      authOps.updateProfile.mockImplementation(async () => {
        calls.push("profile");
      });
      routerSpy.navigate.mockImplementation(async () => {
        calls.push("navigate");
        return true;
      });

      await service.tryRegister(newUser);

      expect(authOps.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        fakeAuth,
        "new@test.com",
        "secret123",
      );
      expect(authOps.updateProfile).toHaveBeenCalledWith(created, {
        displayName: "Player One",
        photoURL: "",
      });
      expect(calls).toEqual(["create", "profile", "navigate"]);
    });

    it("rethrows when the account cannot be created and does not navigate", async () => {
      authOps.createUserWithEmailAndPassword.mockRejectedValue(
        Object.assign(new Error("in use"), {
          code: "auth/email-already-in-use",
        }),
      );

      await expect(service.tryRegister(newUser)).rejects.toThrow("in use");
      expect(authOps.updateProfile).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it("still navigates when only the display name update fails", async () => {
      authOps.updateProfile.mockRejectedValue(new Error("profile"));

      await expect(service.tryRegister(newUser)).resolves.toBeUndefined();
      expect(routerSpy.navigate).toHaveBeenCalledWith(["/"]);
    });
  });

  describe("updateDisplayName", () => {
    it("updates the profile of the current user", async () => {
      authOps.updateProfile.mockResolvedValue(undefined);

      await service.updateDisplayName("Dino Fan");

      expect(authOps.updateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: "Dino Fan",
      });
    });

    it("rethrows when the update fails", async () => {
      authOps.updateProfile.mockRejectedValue(new Error("offline"));

      await expect(service.updateDisplayName("Dino Fan")).rejects.toThrow(
        "offline",
      );
    });
  });

  describe("changePassword", () => {
    const credential = { providerId: "password" };

    beforeEach(() => {
      authOps.emailCredential.mockReturnValue(credential);
      authOps.reauthenticateWithCredential.mockResolvedValue(undefined);
      authOps.updatePassword.mockResolvedValue(undefined);
    });

    it("reauthenticates with the current password before updating", async () => {
      const calls: string[] = [];
      authOps.reauthenticateWithCredential.mockImplementation(async () => {
        calls.push("reauth");
      });
      authOps.updatePassword.mockImplementation(async () => {
        calls.push("update");
      });

      await service.changePassword("old-pass", "new-pass");

      expect(authOps.emailCredential).toHaveBeenCalledWith(
        "test@example.com",
        "old-pass",
      );
      expect(authOps.reauthenticateWithCredential).toHaveBeenCalledWith(
        mockUser,
        credential,
      );
      expect(authOps.updatePassword).toHaveBeenCalledWith(mockUser, "new-pass");
      expect(calls).toEqual(["reauth", "update"]);
    });

    it.each(["auth/wrong-password", "auth/invalid-credential"])(
      "surfaces %s as a wrong password and does not update",
      async (code) => {
        authOps.reauthenticateWithCredential.mockRejectedValue(
          Object.assign(new Error("bad"), { code }),
        );

        await expect(
          service.changePassword("old-pass", "new-pass"),
        ).rejects.toBeInstanceOf(WrongPasswordError);
        expect(authOps.updatePassword).not.toHaveBeenCalled();
      },
    );

    it("rethrows any other reauthentication error unchanged", async () => {
      const failure = Object.assign(new Error("slow down"), {
        code: "auth/too-many-requests",
      });
      authOps.reauthenticateWithCredential.mockRejectedValue(failure);

      await expect(service.changePassword("old-pass", "new-pass")).rejects.toBe(
        failure,
      );
      expect(authOps.updatePassword).not.toHaveBeenCalled();
    });

    it("rethrows when the password update fails", async () => {
      authOps.updatePassword.mockRejectedValue(new Error("offline"));

      await expect(service.changePassword("old-pass", "new-pass")).rejects.toThrow(
        "offline",
      );
    });
  });

  describe("hasPasswordProvider", () => {
    const withProviders = (...ids: string[]) =>
      userSubject.next({
        ...mockUser,
        providerData: ids.map((providerId) => ({ providerId })),
      });

    it("is true for a password-only account", () => {
      withProviders("password");
      expect(service.hasPasswordProvider()).toBe(true);
    });

    it("is false for a Google-only account", () => {
      withProviders("google.com");
      expect(service.hasPasswordProvider()).toBe(false);
    });

    it("is true for an account linked to both", () => {
      withProviders("google.com", "password");
      expect(service.hasPasswordProvider()).toBe(true);
    });
  });

  it("signs out and navigates to the login page", async () => {
    await service.logOut();

    expect(authOps.signOut).toHaveBeenCalledWith(fakeAuth);
    // "/" is a no-op when the user is already on "/", so the guard would never re-run.
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/login"]);
  });
});
