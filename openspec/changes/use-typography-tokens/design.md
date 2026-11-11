# Design

## Context

Colors, spacing and radius are tokens in `src/styles/*.css`, loaded as global styles in `angular.json`. `typography.css` holds only `--font-size-base` (1rem) and `--font-size-l` (1.5rem). `stylelint.config.mjs` already enforces "colors only via `var(--…)`" with `color-no-hex` and `function-disallowed-list`, and `lint:styles` covers `src/**/*.{css,scss}`.

Literals found today (outside `typography.css`):

- Families: `'Fredoka', sans-serif` (10x), `'Quicksand', ui-rounded, system-ui, sans-serif` (3x), `'Roboto', sans-serif` (body in `styles.scss`).
- Weights: 600, 700, 800.
- Sizes (rem): 0.85, 0.9, 0.95, 1, 1.2, 1.4, 1.6, plus three `clamp()` values in `card.component.scss`.
- The Google Fonts `<link>` for Fredoka (500/600/700) and Quicksand (600/700) is already in `src/index.html`.

## Goals / Non-Goals

**Goals:**
- One definition per family, weight and size; no literal values left in component styles.
- No visible change, apart from the two title sizes noted below.
- New literals fail `lint:styles`.

**Non-Goals:**
- Merging near-duplicate sizes or redesigning the type scale.
- Changing which fonts or weights are downloaded.

## Decisions

**Map literals to tokens.** Families, weights and sizes map to a token with the same value, except the 1.4rem and 1.6rem sizes (see below). Snapping 0.95rem to 0.9rem, say, would be a visible design change hidden in a chore. A later change can merge tokens now that they are named. *Alternative:* a tidy 5-step scale; rejected for the visual drift.

**Family tokens: `--font-family-display` (Fredoka), `--font-family-body` (Quicksand stack), `--font-family-default` (Roboto).** The issue names display and body. Roboto is the page default and the Material theme font (`typography: Roboto` in `dino.scss`), so it gets its own token rather than being folded into `body`. Every family token SHALL carry a fallback stack that ends in a generic family, so the text stays readable if the web font fails to load. Call sites use only the token and never repeat the stack. Stacks:
- `--font-family-display`: `'Fredoka', ui-rounded, system-ui, sans-serif`
- `--font-family-body`: `'Quicksand', ui-rounded, system-ui, sans-serif`
- `--font-family-default`: `'Roboto', system-ui, sans-serif`

Fredoka previously had only `sans-serif`; it now gets the same rounded system fallback as Quicksand, which looks closer to the intended design than a plain sans.

**Weight tokens named by role: `--font-weight-semibold` 600, `--font-weight-bold` 700, `--font-weight-extrabold` 800.** The issue suggests `medium`/`bold`, but the code uses 600 and 800, not 500. Names follow the numeric values actually in use. No token for 500 until something uses it.

**One shared scale, no role-specific size tokens:** `--font-size-xs` 0.85, `-s` 0.9, `-m` 0.95, `-base` 1 (exists), `-ml` 1.2, `-l` 1.5 (exists). Titles reuse the scale instead of getting their own tokens, so the 1.4rem and 1.6rem titles both become `--font-size-l`. This is a small visible change (1.4 to 1.5, 1.6 to 1.5), accepted to keep one scale. Fluid card sizes stay as `--font-size-card-letter`, `-emoji` and `-word`, each holding a `clamp()` value, because the lint rule rejects a literal `clamp()` and a fluid size is not a scale step.

**Enforcing the scale:** in `typography.css` a stylelint `custom-property-pattern` lists the only allowed `--font-…` names, so a new token (for example `--font-size-title`) fails `lint:styles` until someone extends the pattern on purpose. The same rule is written for agents in `docs/coding-style.md`.

**Fonts stay loaded in `index.html`.** It is already the single place; moving to `@font-face` or `@import` would add a build or network change for no benefit.

**Lint with `declaration-property-value-allowed-list`.** For `font-family`, `font-size` and `font-weight` allow only a single `var(--name)` plus the CSS-wide keywords `inherit`, `initial`, `unset`, `revert`. Also disallow the `font` shorthand with `property-disallowed-list`, since it would bypass the check. `src/styles/typography.css` gets an override (like `colors.css`) that turns both rules off, because it is where literals are defined. The allow-list was chosen over `declaration-property-value-disallowed-list` from the issue: a disallow-list needs a regex that matches every literal form (`1.4rem`, `clamp(...)`, `600`, `'Fredoka'`), while an allow-list is simply "must be a variable".

## Risks / Trade-offs

- [`font-weight: 800` on the card letter is not in the loaded Fredoka/Quicksand weights, so the browser already synthesizes it] → Keep the value unchanged; tokenizing does not alter rendering. Flag it as a separate follow-up.
- [SCSS interpolation or `$variables` in a value would trip the allow-list] → None exist today; if one appears, use a CSS variable.
- [`var(--x)` is accepted even if `--x` is undefined] → The lint rule cannot check this; a visual check of the touched screens covers typos.

## Migration Plan

Single PR, no data or deploy steps. Rollback is a revert.
