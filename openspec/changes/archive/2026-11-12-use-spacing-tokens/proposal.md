# Proposal

## Why

Component styles still hard-code `padding`, `margin` and `gap` as literal px values (about 60 declarations in 17 stylesheets, with near-duplicates such as 10/11/12px and 13/14px) next to the tokens in `src/styles/spacing.css`. Colors are already locked down by stylelint; spacing drifts because nothing stops a new literal value. See GitHub issue #119.

## What Changes

- Complete the scale in `src/styles/spacing.css` with the steps that are still missing (see design.md), and express every step in `rem` instead of px so spacing follows the user's browser font-size setting.
- Replace every literal length for `padding`, `margin` and `gap` in component and global stylesheets with these variables. Values that are not on the scale snap to the nearest step, so some spacing shifts by 1-4px.
- Remove the `16px` fallback in `var(--padding-default, 16px)` and turn the `--grid-gap` literals in the deck into token references.
- Add a stylelint rule so a literal length in `padding*`, `margin*` or `gap` fails `npm run lint:styles`; `spacing.css` itself is exempt.

## Capabilities

### New Capabilities

- `spacing-tokens`: spacing in stylesheets comes from the shared spacing tokens, and the linter rejects literal values.

### Modified Capabilities

None.

## Impact

- `src/styles/spacing.css`: new tokens.
- `stylelint.config.mjs`: new rule plus a `spacing.css` exemption.
- All stylesheets under `src/app/**` and `src/styles/styles.scss` that declare spacing, including the known leftovers `gap: 8px` and `margin-top: 14px` in `scoreboard.component.scss`.
- Small, intended visual differences from snapping; checked by the existing e2e run and a visual pass.
- No new dependencies. Out of scope: other lengths (`width`, `font-size`, `border-radius`, `top/left`), `rem`-based redesign, and changing the layout.
