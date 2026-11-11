# Design

## Context

`spacing.css` holds two token families: `--gap-*` (xs 4, s 12, default 16, l 24) and `--padding-*` (xs 6, small 12.8, default 16, l 24, xl 32). It is loaded globally through `angular.json`. Stylelint (`stylelint.config.mjs`, `postcss-scss`) already bans hex, named and function colors. The tokens are currently in px. Current literal values in use: 4, 6, 8, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 32, 36, 40, 48, 50, plus `-1px` in the visually-hidden helper. No component uses inline `styles:` in TypeScript.

## Goals / Non-Goals

**Goals:**
- One token per distinct step, no near-duplicates.
- A lint rule that makes the "done" criterion permanent.

**Non-Goals:**
- Renaming existing tokens (keeps the diff reviewable).
- Pixel-exact preservation of odd values like 11px or 13px.
- Converting non-spacing lengths (`width`, `font-size`, `border-radius`) to rem.

## Decisions

**One base per family; every step is a `calc()` of it.** `--gap-base`, `--padding-base` and `--margin-base` are each 1rem, and every other step is `calc(var(--x-base) * factor)`. Changing a base rescales its whole family, and a family can be tuned without touching the others. `--*-default` aliases the base. Alternative: one shared `--space-base`; rejected, the issue and the existing tokens keep gap, padding and margin separate.

**Tokens in `rem`, not px.** Spacing then scales with the browser's default font size, so users who enlarge text get proportional room instead of cramped text in fixed gaps (WCAG 1.4.4 resize text, 1.4.12 text spacing). At the default 16px root, 1rem equals 16px, so the mapping table below keeps its numbers: 4px = 0.25rem, 6px = 0.375rem, 8px = 0.5rem, 12px = 0.75rem, 16px = 1rem, 20px = 1.25rem, 24px = 1.5rem, 32px = 2rem, 48px = 3rem. Alternative: keep px; rejected, the only argument for px is exact pixel control, which this app does not need. Not `em`: it compounds with nested font sizes. The root font size must stay at the browser default; `src/styles/dino.scss` sets no `font-size` on `html` today.

**Snap to the nearest step.** Odd values are inconsistencies, not intent. Mapping:

| Literal | Token |
| --- | --- |
| 4 | `--gap-xs` |
| 6 | `--padding-xs` for padding; `--gap-xs` for gap and margin |
| 8, 10 | new `--gap-sm` (0.5rem) |
| 11, 12, 13, 14 | `--gap-s` / `--padding-s` / `--margin-s` (0.75rem) |
| 16, 18 | `--gap-default` / `--padding-default` |
| 20, 22 | new `--padding-m` (1.25rem) |
| 24 | `--gap-l` / `--padding-l` |
| 32, 36, 40 | `--padding-xl` |
| 48, 50 | new `--padding-xxl` (3rem) |

Each property has its own family: `gap` uses `--gap-*`, `padding` uses `--padding-*`, `margin` uses `--margin-*`. Where the table says `--gap-*` or `--padding-*` for a margin, use the `--margin-*` step with the same size (`--margin-xs`, `-sm`, `-s`, `-default`, `-l`, `-xl`). New tokens: `--gap-sm`, `--padding-m`, `--padding-xxl`, and the whole `--margin-*` family. Alternative: add a token per observed value (18 tokens); rejected, it keeps the drift the issue wants to remove.

**Lint with `declaration-property-value-disallowed-list`.** Property regex `/^(padding|margin|gap|row-gap|column-gap)(-.+)?$/` with value regex matching a number followed by `px|rem|em` (rem literals are banned too; only tokens carry them) (also inside `calc`). No plugin needed. `0`, `auto`, `inherit` and `var()` pass. An override disables the rule for `src/styles/spacing.css`. Alternative: `stylelint-declaration-strict-value`; rejected, a new dependency for one rule.

**Edge cases.**
- `margin: -1px` in the visually-hidden helper is an accessibility technique, not layout: keep it with a targeted `stylelint-disable-next-line` and a reason.
- `--grid-gap` in `deck.component.css` becomes `var(--gap-sm)` / `var(--gap-default)`, so the literal is no longer hidden behind a custom property.
- `var(--padding-default, 16px)` loses its fallback; the token is always loaded.

## Risks / Trade-offs

- [A rem token changes size if the root font size is changed later] -> Keep `html` without a font-size override; the lint rule does not guard this.
- [Snapping shifts spacing by up to 4px (e.g. 50 -> 48, 40 -> 32 on the auth form)] -> Review each file visually and run e2e; adjust the mapping per file only with a stated reason.
- [Custom properties such as `--grid-gap: 0.5rem` bypass the rule] -> Convert the known one now; accept that the rule covers the properties named in the issue.
- [Regex misses unusual units (`vw`, `%`)] -> Intentional: those are relative, not fixed spacing.
