# Design

## Context

See proposal.md for motivation. Observed state (before `fix-register-screen` lands):

- Login: `form()` from `@angular/forms/signals` with a schema (`required`, `email`, `minLength` plus messages), `[formField]` bindings, `<label>` wrapping the input, errors rendered from `errors()`. No `aria-invalid`/`aria-describedby`; the email label has no `for`.
- Register: `UntypedFormGroup` with `Validators`, `formControlName`, separate `<label for>` + input, `aria-invalid` + `aria-describedby`, hardcoded messages in the template.
- Message text differs for the shared rules: register says "Please enter a valid email address" and "Min password length is 6"; login says "Please enter a valid email" and "Password minimum of 6 characters". The e2e login spec asserts the login texts.
- Register has an extra `name` field and, after `fix-register-screen`, a `registerError` and `submitting` signal.

## Goals / Non-Goals

**Goals:**
- One validation definition for the shared email and password rules.
- Same accessible field markup on both forms.

**Non-Goals:**
- Changing the visual design or the shared `_auth-form.scss`.
- New validation rules (the minimum stays 6; Firebase's own rules still apply).

## Decisions

1. **Register moves to signal forms; login's messages win.** Login is already on the newer API, and the repo is moving that way. The unified texts are login's ("Please enter a valid email", "Password minimum of 6 characters"), because the e2e login spec already asserts them. Alternative: keep register on reactive forms and only align markup; rejected because the validation would stay defined twice.
2. **Share the rules as a schema function, not a component.** Add `src/app/user/auth-schema.ts` exporting a function that applies the email and password rules (with messages) to a schema path; both components call it, and register adds `required(name)` on top. Alternative: a shared `<app-auth-field>` component; rejected because with the `[formField]` directive it needs extra plumbing (field-state input, id generation) to save about 10 lines of markup in two templates. Revisit if a third form appears.
3. **Field markup follows register's pattern**: `<label for>` + sibling input with an id, `[attr.aria-invalid]` and `[attr.aria-describedby]` tied to the error `<p role="alert" id>`. It is the more accessible pattern and the existing login e2e uses `getByLabel`, which keeps working. Drop the trailing colons in login labels so the label text is identical on both forms.
4. **Footer copy**: "Don't have an account? Register" on login; register's footer is unchanged.
5. **Name validation** stays register-only (`required`, message "Name is required").

## Risks / Trade-offs

- [Both forms change at once, so a regression hits both] → keep the existing login unit and e2e specs as the safety net and extend them to assert the aria attributes.
- [Merge conflicts with `fix-register-screen`, which also edits the register component and its spec] → implement after that change is merged and rebase; tasks start with that check.
- [Signal forms API is relatively new and may change] → login already depends on it, so no new exposure.
