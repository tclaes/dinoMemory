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
