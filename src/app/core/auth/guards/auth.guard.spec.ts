import { TestBed } from "@angular/core/testing";
import { Auth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { firstValueFrom, isObservable, ReplaySubject } from "rxjs";
import { beforeEach, describe, expect, it } from "vitest";

import { AuthGuard } from "./auth.guard";
import { AUTH_OPS } from "../auth-ops";
import { mockUser } from "../../../../testing/firebase-mocks";
import { createSpyObj, SpyObj } from "../../../../testing/spy";

describe("AuthGuard", () => {
  let guard: AuthGuard;
  // Like Firebase's onAuthStateChanged: emits nothing until the SDK has resolved the auth state,
  // then replays the current state to every new subscriber.
  let userSubject: ReplaySubject<any>;
  let routerSpy: SpyObj<Router>;
  const loginTree = { redirectTo: "/login" } as any;

  // The guard may answer synchronously (boolean/UrlTree) or asynchronously (Observable/Promise).
  const resolve = (result: unknown) =>
    isObservable(result) ? firstValueFrom(result) : Promise.resolve(result);

  beforeEach(() => {
    userSubject = new ReplaySubject<any>(1);
    routerSpy = createSpyObj("Router", ["navigate", "createUrlTree"]);
    routerSpy.createUrlTree.mockReturnValue(loginTree);

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: {} },
        { provide: AUTH_OPS, useValue: { user: () => userSubject } },
        { provide: Router, useValue: routerSpy },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  it("allows navigation when the user is already known", async () => {
    userSubject.next(mockUser);

    const result = await resolve(guard.canActivate());

    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Reproduces the login redirect bug: signInWithEmailAndPassword resolves and the service
  // navigates to "/" before Firebase has emitted the new user, so user() is still undefined.
  // The guard must wait for the auth state instead of treating "not yet known" as "logged out".
  it("waits for the auth state to resolve instead of redirecting to /login", async () => {
    const pending = resolve(guard.canActivate());

    userSubject.next(mockUser);

    expect(await pending).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it("redirects to /login when the resolved auth state has no user", async () => {
    const pending = resolve(guard.canActivate());

    userSubject.next(null);

    const result = await pending;
    const redirected =
      result === loginTree ||
      routerSpy.navigate.mock.calls.some(([commands]) => commands[0] === "/login");
    expect(result).not.toBe(true);
    expect(redirected).toBe(true);
  });
});
