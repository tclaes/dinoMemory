# Tasks

## 1. Preconditions

- [x] 1.1 Confirm `fix-register-screen` is merged to `master` and rebase this branch on it. Verify with `git log master --oneline | grep -i register` and a clean `npm run build`.

## 2. Shared validation

- [x] 2.1 Add `src/app/user/auth-schema.ts` with a function applying the email and password rules and messages to a schema path, and refactor `LoginComponent` to use it. Verify that the existing login unit spec passes unchanged and `e2e/login.spec.ts` validation texts still match.

## 3. Register on signal forms

- [x] 3.1 Migrate `RegisterComponent` from `UntypedFormGroup` to `form()` with the shared schema plus `required(name)`; keep `registerError` and `submitting` behavior. Verify with the rewritten `register.component.spec.ts` (empty form invalid, invalid email and short password show the unified messages, valid form enables the button, submit calls `tryRegister` with name, email and password).
- [x] 3.2 Update the register template to `[formField]` bindings with messages taken from `errors()`. Verify with a template test that no hardcoded message text remains and the register e2e still passes.

- [x] 3.3 Make both submit handlers apply a debounced email edit that is still pending (call `markAsTouched()` on the email field before reading the value). Verify with the login and register unit tests that submit right after typing sends the new address.

## 4. Field markup and copy

- [x] 4.1 Update the login template to `<label for>` + input with ids, `aria-invalid` and `aria-describedby` linked to the error element; drop the colons from the labels. Verify with login unit tests asserting `aria-invalid` and `aria-describedby`, and `getByLabel('Email')` still resolving to one input in e2e.
- [x] 4.2 Change the login footer to "Don't have an account?" with a "Register" link. Verify by updating the login unit/e2e spec to assert the text and the link target `/register`.

## 5. Final check

- [x] 5.1 Run `npm run lint`, unit tests and `npm run e2e` and verify they pass; open both pages at desktop and 375px and compare them visually.
