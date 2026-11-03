# Tasks

## 1. Layout

- [x] 1.1 Replace the `.auth-page` wrapper in `register.component.html` with the login structure and add the login `:host` grid rule to `register.component.scss`; remove the unused `.auth-page` block from `_auth-form.scss`. Verify with `npm run build` and by opening `/register` at desktop and 375px widths (card centred, no horizontal scroll).

## 2. Registration flow

- [x] 2.1 Make `AuthService.tryRegister` async: await create, await `updateProfile` (name), navigate to `/`, rethrow create errors, remove `console.log`. Verify with new `auth.service.spec.ts` cases (success order, error rethrown, no navigation on failure).
- [x] 2.2 Add `registerError` and `submitting` signals to `RegisterComponent`, map `auth/email-already-in-use`, `auth/weak-password` and other errors to messages, render the error with `role="alert"` and disable the button while submitting. Verify with updated `register.component.spec.ts` (failure message shown, button re-enabled, no double submit).

## 3. End-to-end

- [x] 3.1 Add `e2e/register.spec.ts`: register a new user and land on the game page signed in; register an existing email and see the error while staying on `/register`. Verify with `npm run e2e`.
- [x] 3.2 Run `npm run lint` and the unit tests and verify they pass.
