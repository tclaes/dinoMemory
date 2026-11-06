# Design

## Context

See proposal.md for motivation. Observed state:

- `UserprofileComponent` (`src/app/user/userprofile.component.ts`) is empty; its template is commented out and its spec only checks creation. It is routed at `user` under the `AuthGuard` layout in `app.routes.ts`.
- The header profile button links to `userprofile`, which matches no route, so the wildcard route redirects to `/`. The login e2e visits `/userprofile` only to check a signed-out visitor does not crash.
- `AuthService` exposes `user` (a `toSignal` of the Firebase user) and, via the injectable `AUTH_OPS` token, wraps the Firebase auth functions so specs can swap in spies. `updateProfile` is already wrapped; `updatePassword` and the reauthentication functions are not.
- Login and register use signal forms with the shared `applyCredentialRules` schema in `src/app/user/auth-schema.ts`, `<label for>` fields and `aria-invalid` / `aria-describedby` markup (spec `auth-forms`), styled by the shared `_auth-form.scss`.

## Goals / Non-Goals

**Goals:**
- A profile page built the same way as login and register, so it needs no new form patterns.
- Keep all Firebase calls behind `AUTH_OPS` so the new behavior is unit-testable without Firebase.

**Non-Goals:**
- Storing anything in Firestore. Display name and password live in Firebase Auth. The per-player deck preference is a separate follow-up change.
- Changing the email address or handling password reset by email.

## Decisions

1. **Fix the link, keep the route.** Point the header button at `/user` instead of renaming the route to `userprofile`. It is a one-word change in a template, and the route name was never exposed anywhere else. Alternative: rename the route; rejected because it touches the router and the login e2e for no gain.
2. **Two independent forms on one page: name and password.** Each is its own `form()` with its own submit, pending state and feedback, so a failed password change never blocks saving a name. Alternative: one combined form; rejected because the actions have different reauthentication needs and different failure messages.
3. **Reuse the password rule, not the whole credential schema.** Export the minimum-length rule from `auth-schema.ts` (a small `applyPasswordRules(passwordPath)` that `applyCredentialRules` also calls) so the new-password field gets the same rule and message. The current-password field is only `required`.
4. **Change the password with reauthentication.** Firebase rejects `updatePassword` for a stale sign-in, so the flow is: build an `EmailAuthProvider` credential from the user's email and the entered current password, call `reauthenticateWithCredential`, then `updatePassword`. This also gives the "current password is incorrect" check: `auth/wrong-password` and `auth/invalid-credential` map to that message, every other error to the generic one. The three functions are added to `AuthOps`.
5. **Detect password accounts from the provider list.** The password section is shown when `user.providerData` contains `providerId === "password"`. A Google-only account has only `google.com`. An account linked to both shows the section. Alternative: check how the player signed in this session; rejected because it is not available after a reload.
6. **Display name through `updateProfile`.** `AuthService` gets `updateDisplayName(name)`, which calls the existing wrapped `updateProfile`. Firebase mutates the current user object in place, so the page reads the name from a local signal that is set after a successful save instead of relying on the `user` signal to re-emit.
7. **Do not mark the user as the source of truth for an empty name.** Registration saves the name best effort, so `displayName` can be `null`. The name field starts empty in that case, and the template never interpolates the raw value.

8. **Header entry stays the existing icon button.** No extra text link; the spec says "profile button" and the button already carries `aria-label="Your profile"`.

## Risks / Trade-offs

- [`user` signal may not re-emit after `updateProfile`, leaving other screens with the old name] → The profile page uses its own signal; no other screen currently shows the display name. Revisit if one is added.
- [Mapping Firebase error codes is brittle: the code for a wrong password differs between SDK versions] → Treat both `auth/wrong-password` and `auth/invalid-credential` as the wrong-password case, and cover both in unit tests.
- [Reauthentication can hit `auth/too-many-requests`] → It falls into the generic failure message, which asks the player to try again.
- [The e2e must change a password against the Auth emulator] → Register a unique player per test, as `e2e/register.spec.ts` already does.
