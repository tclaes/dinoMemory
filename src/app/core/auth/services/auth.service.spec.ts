import { TestBed } from "@angular/core/testing";
import { Auth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
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
  let routerSpy: SpyObj<Router>;
  const fakeAuth = {};

  beforeEach(() => {
    const mocks = createMockAuthOps();
    authOps = mocks.ops;
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

  it("should navigate to homepage after successful login", async () => {
    await service.signInWithEmailAndPassword({
      email: "test@test.com",
      password: "test123",
    });

    expect(routerSpy.navigate).toHaveBeenCalledWith(["/"]);
  });
});
