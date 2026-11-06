# Design

## Context

Logout already works: `AuthService.logOut()` signs out and then navigates to `/login`, and `AuthGuard` sends visitors without a session to `/login`. See proposal.md for why this is only being specified. The earlier bug navigated to `/`, which is a no-op when already on `/`, so the guard never re-ran.

## Goals / Non-Goals

**Goals:**
- Record the existing logout and signed-out access behavior as a spec.
- Make sure the tests cover each scenario.

**Non-Goals:**
- Changing logout behavior, the guard, or the UI.
- Session timeouts or sign-out on other devices.

## Decisions

- **New capability `user-session` instead of extending `auth-forms` or `user-profile`.** `auth-forms` covers the login and register form fields; logout is session behavior and belongs in its own capability.
- **Spec the behavior as observed by the user, not the navigation call.** Requirements say "the login page is shown", so the implementation may change without changing the spec.
- **Reuse `e2e/logout.spec.ts`.** It covers sign-out from the game and the signed-out revisit of `/`. The profile-page scenarios are the only ones without coverage.

## Risks / Trade-offs

- [Spec drifts from tests] → Task 1.1 maps each scenario to a test and adds the missing profile-page ones.
