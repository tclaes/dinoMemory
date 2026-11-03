## Why

The register screen is broken in two ways. Its layout is not centred and does not match the login screen, and registering gives no usable result: the player stays on the form, errors only reach the browser console, and the display name can go missing. A new player cannot reliably create an account today.

## What Changes

- Fix the register page layout so it fills the viewport and centres the card, like the login page.
- Make registration an awaited flow: create the account, set the display name, then navigate to the game (`/`).
- Show a clear error on the form when registration fails (email already in use, weak password, other failures) instead of logging to the console.
- Prevent double submits while a registration request is in flight.
- Add unit and e2e coverage for registration (none exists for the e2e flow today).

## Capabilities

### New Capabilities
- `user-registration`: the register screen, its validation, and what happens on success or failure.

### Modified Capabilities
<!-- None: no existing spec covers registration. -->

## Impact

- `src/app/user/components/register/` (template, scss, component, spec)
- `src/app/user/_auth-form.scss` (shared styles; `.auth-page` becomes unused)
- `src/app/core/auth/services/auth.service.ts` (`tryRegister` returns a promise, navigates, no console logging) and its spec
- `e2e/` (new `register.spec.ts`)
- Out of scope: Google sign-up, email verification, password rules beyond the existing minimum of 6, translating the UI copy (login is partly Dutch, register English).
