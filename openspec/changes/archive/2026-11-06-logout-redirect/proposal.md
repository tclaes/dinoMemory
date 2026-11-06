# Proposal

## Why

Signing out of the game once left the game on screen because the redirect after logout was a no-op. That was fixed in PR #96 and is covered by `e2e/logout.spec.ts`, but never specified, so nothing in `openspec/specs/` says what logging out must do. This change records the existing behavior so it cannot regress unnoticed.

## What Changes

- Add a spec for signing out: the "Bye!" button ends the session and shows the login page, and protected pages stay unreachable afterwards.
- No application code changes. The behavior already exists and is verified by the e2e logout tests.

## Capabilities

### New Capabilities
- `user-session`: Ending a signed-in session (logout) and what a signed-out visitor can reach.

### Modified Capabilities

## Impact

- Specs only: new `openspec/specs/user-session/spec.md` after archive.
- Existing code (`AuthService.logOut()`, `AuthGuard`) and `e2e/logout.spec.ts` are unchanged.
