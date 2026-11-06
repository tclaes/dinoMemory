# Tasks

## 1. Reach the profile page

- [x] 1.1 Point the header profile button at `/user` in `navigation.component.html`. Verify with the navigation spec asserting the link target `/user`, and an e2e that signs in, selects the profile button and sees the profile page.

## 2. Auth operations

- [x] 2.1 Add `updatePassword`, `reauthenticateWithCredential` and `EmailAuthProvider.credential` to `AuthOps` / `AUTH_OPS` in `auth-ops.ts`. Verify with `npm run build` and the existing auth specs passing unchanged.
- [x] 2.2 Add `AuthService.updateDisplayName(name)` (via the wrapped `updateProfile`) and `AuthService.changePassword(currentPassword, newPassword)` (reauthenticate, then update; map wrong-password codes `auth/wrong-password` and `auth/invalid-credential` to a distinct error). Verify with `auth.service.spec.ts`: name update calls `updateProfile`, change calls reauthenticate before update, the wrong-password codes surface as the wrong-password error, any other error as a generic one, and update is not called when reauthentication fails.
- [x] 2.3 Add `AuthService.hasPasswordProvider()` (or a computed) based on `providerData` containing `password`. Verify with unit tests for a password-only, Google-only and linked account.

## 3. Shared password rule

- [x] 3.1 Extract `applyPasswordRules(passwordPath)` in `auth-schema.ts`, called by `applyCredentialRules`, so the new-password field reuses the same rule and message. Verify that the existing login and register specs pass unchanged and a new unit test covers the rule on its own.

## 4. Profile page

- [x] 4.1 Rebuild `UserprofileComponent` with the account details (display name, email) and the display-name form: signal form with `required`, label/`aria-invalid`/`aria-describedby` markup, saving and feedback states, and no "undefined" text for a missing name. Verify with `userprofile.component.spec.ts`: shows name and email, empty field for a missing name, "Name is required" and disabled save for an empty name, success after save, failure message and kept value when saving fails.
- [x] 4.2 Add the password form (current password, new password) shown only when `hasPasswordProvider()` is true, with the unified minimum-length message, wrong-password and generic failure messages, and cleared fields after success. Verify with component specs: section hidden for a Google account and shown for a password account, short password blocks save, wrong password and generic failure messages, success clears fields.
- [x] 4.3 Style the page with the shared auth form styles and check it at desktop and 375px width. Verify with `npm run lint:styles` and a visual comparison with the login screen.

## 5. End to end and final check

- [x] 5.1 Add `e2e/profile.spec.ts` against the Auth emulator: register a unique player, change the display name and see it after a reload, change the password, sign out and sign in with the new password, and see the wrong-current-password message. Verify with `npm run e2e`.
- [x] 5.2 Run `npm run lint`, `npm run lint:styles`, the unit tests and `npm run e2e`. Verify that all pass.
