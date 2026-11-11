# spacing-tokens Specification

## Purpose
Keeps spacing in the app consistent by defining it once in shared spacing tokens and making the style linter reject literal values elsewhere.

## Requirements

### Requirement: Spacing comes from shared tokens in rem
Stylesheets SHALL express `padding`, `margin` and `gap` (including their longhand, logical and `row-`/`column-` variants) with the spacing tokens defined in `src/styles/spacing.css`, or with `0`, `auto` or `inherit`. The tokens SHALL be defined in `rem`, with `gap`, `padding` and `margin` each having their own token family whose steps are all calculated from one base token of that family, so spacing scales with the user's font-size setting. No stylesheet other than `spacing.css` SHALL contain a literal length (px, rem or em) for these properties.

#### Scenario: Existing stylesheets
- **WHEN** all component and global stylesheets are inspected
- **THEN** none contains a literal px, rem or em value for `padding`, `margin` or `gap`

#### Scenario: Token definitions
- **WHEN** `src/styles/spacing.css` is read
- **THEN** it is the only stylesheet that holds literal spacing lengths, every step used by the app is defined there, and none of them is in px

### Requirement: Linter rejects literal spacing
The `lint:styles` command SHALL fail when a stylesheet declares a literal length for `padding`, `margin` or `gap`, and SHALL pass when it uses tokens, `0`, `auto` or `inherit`.

#### Scenario: Literal value added
- **WHEN** a component stylesheet gets `gap: 8px` and `npm run lint:styles` runs
- **THEN** the command exits non-zero and reports the declaration

#### Scenario: Token used
- **WHEN** a component stylesheet uses `gap: var(--gap-s)` and `npm run lint:styles` runs
- **THEN** the command reports no spacing violation

#### Scenario: Token file exempt
- **WHEN** `src/styles/spacing.css` defines `--gap-xs: 0.25rem`
- **THEN** `npm run lint:styles` reports no violation for it
