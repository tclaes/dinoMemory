# Tasks

## 1. Define tokens

- [x] 1.1 Add the family, weight, size and fluid card-size tokens from design.md to `src/styles/typography.css` (keep `--font-size-base` and `--font-size-l`); every family token must end in a generic family (`sans-serif`) as fallback; verify with `npm run build`, by checking the `:root` custom properties in the dev server's devtools, and with `grep -n "font-family-" src/styles/typography.css` showing `sans-serif` on each line
- [x] 1.2 Switch `body` in `src/styles/styles.scss` to `var(--font-family-default)`; verify the page default font still renders as Roboto

## 2. Replace literals in component styles

- [x] 2.1 Replace literals in `layout.component.css`, `_auth-form.scss` and `userprofile.component.scss`; verify with `grep -nE "font-(family|size|weight):\s*[^v]" ` on those files returning nothing
- [x] 2.2 Replace literals in the game-status-bar components (`timer`, `clicks`, `show-scores`, `restart`), `navigation.component.scss` and `scoreboard.component.scss`; verify with the same grep returning nothing
- [x] 2.3 Replace the `clamp()` sizes and weights in `card.component.scss` with the card tokens; verify the letter and word cards look unchanged in the dev server
- [ ] 2.4 Compare the login, register, profile, navigation, playfield and scoreboard screens before and after in the browser; verify no visible difference in family, size or weight

## 3. Enforce with stylelint

- [x] 3.1 Add `declaration-property-value-allowed-list` for `font-family`, `font-size` and `font-weight` and `property-disallowed-list` for `font` to `stylelint.config.mjs`, with an override that turns both off for `src/styles/typography.css`; verify `npm run lint:styles` passes on the migrated code
- [x] 3.2 Prove the rule bites: temporarily add `font-size: 1rem`, `font-weight: 600` and `font-family: Fredoka` to a component stylesheet and verify `npm run lint:styles` fails on each, then remove them
- [x] 3.3 Update the comment at the top of `stylelint.config.mjs` to mention typography tokens; verify it reads correctly

## 4. Keep the scale closed

- [x] 4.1 Fold the title sizes into the scale (1.4 and 1.6 to `--font-size-l`, 1.2 to `--font-size-ml`); verify `grep -rn "title-" src` returns nothing
- [x] 4.2 Add `custom-property-pattern` for `typography.css` and tighten the value pattern to a single `var(--name)`; verify a new `--font-size-title-l` token and `font-size: var(--a), 2rem` both fail `lint:styles`
- [x] 4.3 Add the font-token rule to `docs/coding-style.md` and mention it in `AGENTS.md`; verify the section reads correctly

## 5. Final check

- [x] 5.1 Run `npm run lint`, `npm run lint:styles`, unit tests and `npm run e2e`; verify all pass (see `test.yml` for the CI equivalents)

## Workflow follow-up

- Archive the change after review.
