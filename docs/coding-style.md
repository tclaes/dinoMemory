# Coding style

## Early return, no `else if`

- Do not chain `else if`. Handle each case with a guard clause that returns (or throws) early, and let the main path continue unindented.
- Avoid `else` after a `return`. It adds nesting without adding meaning.

```ts
// Avoid
if (!user) {
  return null;
} else if (!user.isActive) {
  return null;
} else {
  return user.name;
}

// Prefer
if (!user) return null;
if (!user.isActive) return null;
return user.name;
```

## KISS

- Choose the simplest solution that works. Prefer plain, readable code over clever or compact code.
- Add an abstraction only when it removes real complexity, not to look flexible.

## YAGNI

- Build only what the current task needs. No speculative parameters, options, hooks or layers "for later".
- Delete unused code instead of keeping it around.

## Styling: reuse the font tokens

- Fonts come only from `src/styles/typography.css`: `font-family`, `font-size` and `font-weight` must be `var(--font-…)` (enforced by `npm run lint:styles`).
- Pick the nearest existing step of the scale. Do not add a token for one component or role (no `--font-size-title`, `--font-size-button`). A title and a button that are both large use the same `--font-size-l`.
- Only add a scale step when no existing step fits across several places, and say why in the PR. Adding one means extending the `custom-property-pattern` in `stylelint.config.mjs`; the lint will reject any other new `--font-…` name.
- Every `--font-family-*` token ends in a generic fallback family (`sans-serif`).
