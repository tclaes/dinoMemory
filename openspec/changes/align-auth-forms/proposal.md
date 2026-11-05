## Why

The login and register screens do the same job but are built differently: login uses signal forms, register uses untyped reactive forms; login lacks the accessibility markup register has; and the login footer is Dutch in an otherwise English app. Differences like this make each fix twice as expensive and the two screens drift further apart.

## What Changes

- Move the register form to signal forms, using the same schema-based validation pattern as login.
- Give both forms the same field markup: a label bound to its input with `for`/`id`, `aria-invalid` on invalid touched fields, and `aria-describedby` pointing at the visible error message.
- Take validation messages from the form schema on both screens (no hardcoded message text in templates).
- Translate the Dutch login footer ("Nog geen account? Registreren") to English.
- Optional, decided in design: extract a small shared field component if the duplication justifies it.

## Capabilities

### New Capabilities
- `auth-forms`: shared behavior of the login and register forms: field labelling, error association, validation messaging and UI language.

### Modified Capabilities
- `user-registration`: the validation messages for an invalid email and a short password now match the login form.

## Impact

- `src/app/user/components/register/` and `src/app/user/components/login/` (templates, components, specs)
- `e2e/login.spec.ts` and the new `e2e/register.spec.ts` (selectors and texts)
- **Built on `fix-register-screen` (merged)**: that change introduced the `registerError`/`submitting` signals, the awaited `AuthService.tryRegister` and the register layout.
- Out of scope: new auth features (Google sign-up, email verification, password rules), changes to the visual design, translating the UI to Dutch.
