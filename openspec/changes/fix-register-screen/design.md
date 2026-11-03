# Design

## Context

Findings from the current code (see proposal.md for motivation):

- **Layout:** `login.component.scss` sets `:host { display: grid; min-height: 100dvh; place-items: center; background }`. `register.component.scss` only imports the shared partial. `<app-register>` is therefore an inline element, and its `.auth-page` wrapper has no height, so the card sits at the top of the page and the `::before`/`::after` decoration circles are clipped in a collapsed box. `.auth-page` is used by no other component.
- **Function:** `AuthService.tryRegister()` fires `createUserWithEmailAndPassword(...).then(updateProfile...)` without returning or awaiting anything. It never navigates (the user is silently signed in but stays on `/register`), `updateProfile` is not awaited (so the display name can be unset when the next screen reads it), and failures only go to `console.log`. The component cannot know the result.
- `signInWithEmailAndPassword` in the same service is the established pattern: async, navigates on success, and the component catches errors and shows a message.

## Goals / Non-Goals

**Goals:**
- Match the login screen's layout approach and error-handling pattern.
- Make the register outcome observable by the component.

**Non-Goals:**
- Migrating the form to signal forms (login uses them, register uses reactive forms); not needed to fix the bugs.
- Google sign-up, email verification, extra password rules, copy translation.

## Decisions

1. **Layout: copy the login `:host` rule, drop the `.auth-page` wrapper.** Simplest and visually identical to login. Alternative: give `.auth-page` `min-height: 100dvh` and keep the decorative circles; rejected because login has no such decoration, so the two screens would differ. Remove the unused `.auth-page` block from `_auth-form.scss`.
2. **`tryRegister` becomes `async`, awaits create then `updateProfile`, then navigates to `/`.** It rethrows errors. Alternative: return the credential and navigate in the component; rejected to stay consistent with `signInWithEmailAndPassword`/`loginWithGoogle`, which navigate in the service.
3. **Component owns the error message** via a `registerError` signal, mapped from the Firebase error code: `auth/email-already-in-use` → "This email is already in use.", `auth/weak-password` → password message, anything else → "Registration failed. Please try again." A `submitting` signal disables the button during the request. Alternative: show raw `err.message`; rejected as unfriendly and untestable.
4. **Tests:** update the component spec (success clears error, failure shows mapped message, button disabled while submitting), add an `AuthService` spec case for the order create → updateProfile → navigate, and add `e2e/register.spec.ts` against the Auth emulator.

## Risks / Trade-offs

- [`updateProfile` fails after the account was created] → the account exists and the user is signed in, so showing a registration error would be misleading. Catch this failure separately in the service, still navigate, and leave the name unset.
- [Dropping `.auth-page` removes decoration] → none today since login never had it.
