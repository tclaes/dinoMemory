# Tasks

## 1. Tokens and lint rule

- [x] 1.1 Convert the existing tokens in `src/styles/spacing.css` from px to rem (same visual size at the default 16px root), derive every step from `--gap-base`, `--padding-base` or `--margin-base` with `calc()`, and add `--gap-sm`, `--padding-m`, `--padding-xxl` and the `--margin-*` family. Verify: no px remains in the file and each step resolves to the size in design.md.
- [x] 1.2 Add the `declaration-property-value-disallowed-list` rule and the `spacing.css` override to `stylelint.config.mjs`. Verify: `npm run lint:styles` now fails on the current literals and does not report `spacing.css`.

## 2. Replace literals

- [x] 2.1 Convert the game stylesheets (`game/**`, including `scoreboard.component.scss` leftovers and `deck.component.css` `--grid-gap`) using the mapping in design.md; drop the `var(--padding-default, 16px)` fallback. Verify: `npm run lint:styles` reports nothing under `src/app/game`.
- [x] 2.2 Convert `nav/`, `ui/layout` and `user/` stylesheets (`_auth-form.scss`, userprofile, register). Verify: `npm run lint:styles` reports nothing under those folders.
- [x] 2.3 Convert `src/styles/styles.scss`, keeping the visually-hidden `margin: -1px` behind a commented `stylelint-disable-next-line`. Verify: `npm run lint:styles` passes for the whole project.

## 3. Verification

- [x] 3.1 Run `npm run lint`, `npm test` and `npm run e2e`. Verify: all pass.
- [x] 3.2 Open the game, scoreboard dialog, navigation, login/register and profile pages in the dev server and compare against master. Verify: only the small shifts from snapping are visible; note any that look wrong and adjust the mapping.
