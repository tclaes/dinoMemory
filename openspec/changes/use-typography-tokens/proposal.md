# Proposal

## Why

Typography is hard-coded in component styles: `font-family: 'Fredoka', sans-serif` is repeated across ten-odd rules, and `font-size` and `font-weight` use literal values (`0.9rem`, `0.95rem`, `600`, ...). There is no shared token, so the same visual role is written with slightly different values in different components and the fonts drift. Colors, spacing and radius already live in tokens; typography is the gap (issue #118).

## What Changes

- Add font-family tokens (`--font-family-display`, `--font-family-body`, `--font-family-default`) to `src/styles/typography.css`. Each one includes a fallback stack ending in a generic family.
- Add font-weight tokens (`--font-weight-semibold`, `--font-weight-bold`, `--font-weight-extrabold`) for the values in use (600, 700, 800).
- Extend the font-size scale in `src/styles/typography.css`. The existing `--font-size-base` and `--font-size-l` stay; new tokens cover the sizes in use (no role-specific tokens such as `title`), plus fluid tokens for the card glyphs that use `clamp()`.
- Replace every literal `font-family`, `font-size` and `font-weight` in component and global stylesheets with these tokens. Values map one-to-one, except the 1.4rem and 1.6rem titles, which both use `--font-size-l` (1.5rem).
- Add stylelint rules to `stylelint.config.mjs`: literal values for these properties fail `npm run lint:styles`, and only an approved list of token names may be defined in `typography.css`. `typography.css` is exempt from the first.
- Add a styling rule to `docs/coding-style.md` for agents: reuse existing font tokens, no per-component tokens.
- The Google Fonts `<link>` already sits in one place (`src/index.html`) and stays there.

## Capabilities

### New Capabilities
<!-- None: no user-facing behavior changes. -->

### Modified Capabilities
<!-- None: this is a styling and lint refactor; `skip_specs: true` is set in .openspec.yaml. -->

## Impact

- `src/styles/typography.css`: new tokens.
- `src/styles/styles.scss`: body font-family uses a token.
- Component styles: `layout.component.css`, `_auth-form.scss`, `userprofile.component.scss`, `timer`, `clicks`, `show-scores`, `restart`, `card`, `navigation`, `scoreboard`.
- `stylelint.config.mjs`: new rule plus an override for `typography.css`.
- `docs/coding-style.md`, `AGENTS.md`: the new rule.
- No runtime, API or dependency changes.
- Out of scope: consolidating near-duplicate sizes (0.9 / 0.95rem), loading the 800 weight for Fredoka, and the `font-weight: bold` inside a commented-out `console.log` in `holdable.directive.ts`.
