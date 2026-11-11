# Design

## Context

`ScoreboardComponent` is rendered by `game.component.html` inside `@if (gameService.gameWon())`. Its host element is a `position: fixed` overlay with a manual backdrop. Its `ngOnInit` saves the score once (guarded by `GameService.scoreSaved`) and loads the top 10. The only way to remove it is for `gameWon` to become false, which happens when the game stops (`GlobalService.stopGame()`). The timer already freezes on win (`TimerService`), so a won board can stay on screen without further changes.

Browser guidance consulted: `dialog`, `light-dismiss-a-dialog`, `animate-to-from-top-layer`.

## Goals / Non-Goals

**Goals:**
- Use the native modal `<dialog>` for focus handling, inert page, top layer, `Esc` and backdrop.
- Make "dialog is open" explicit state, so the status bar can offer "Show scores".

**Non-Goals:**
- No changes to score saving, ranking, timer or the "New game?" behavior.
- No Angular Material/CDK dialog; the native element is enough.
- No persistence of the open/closed state across reloads.

## Decisions

### 1. Native `<dialog>` opened with `showModal()`
The scoreboard template becomes a `<dialog>` with `aria-labelledby` on its heading; no `role`, `aria-modal`, focus trap or `Esc` handler. The "New game?" button gets `autofocus`; a close button (`<form method="dialog">`) is added in the header.
Alternatives: keep the fixed overlay and add handlers (re-implements focus, inert, `Esc`); `@angular/cdk` dialog (extra abstraction over a platform feature).

### 2. Open state lives in `GameService`
Add `scoreboardOpen` as a `linkedSignal` sourced from `gameWon`: it becomes `true` when a game is won and `false` when the game stops, with `openScoreboard()` and `closeScoreboard()` methods. The status bar and the scoreboard both read it, and it resets with the game like `scoreSaved` does.
Alternatives: component-local state (the status bar could not see it); a new service (one boolean does not justify it).

### 3. Scoreboard component stays mounted for the whole won game
`game.component.html` keeps `@if (gameWon())` around `<app-scoreboard/>`, but the component now renders a `<dialog>` that is opened and closed from `scoreboardOpen`. Because the component is not destroyed on close, `ngOnInit` still runs exactly once per won game, so the "saved once" guarantee and the loaded top 10 are untouched. An effect syncs the signal to the element (`showModal()` / `close()`), and the dialog's `close` event writes back to the signal, so `Esc`, backdrop and button all end up in the same state.
Alternative: `@if (scoreboardOpen())` around the component would re-run `ngOnInit` on each reopen and need extra guarding.

### 4. Dismissal: `closedby="any"` with a fallback
Set `closedby="any"` for `Esc` and click-outside. `closedby` is not available in Safari, so add the guide's feature-detected pointer fallback (press and release both outside the dialog rectangle, never `event.target` alone, so clicks on padding do not close). `Esc` already works everywhere for modals. The close button is always present.

### 5. Animation with `@starting-style`
Fade and scale on the dialog and fade on `::backdrop` using `transition-behavior: allow-discrete` (declared separately from the `transition` shorthand) and `overlay` in the transition list. The scale lives inside `prefers-reduced-motion: no-preference`; reduced motion only gets a short fade. Firefox and Safari cannot animate the exit, so use the guide's `data-closing` fallback: wait for `getAnimations()` to settle, then call `close()`, and route `cancel` through the same helper. A probe (`canTransitionDisplay`) decides whether the fallback is needed.

### 6. Status bar action
A "Show scores" button in `GameStatusBarComponent` renders only when `gameWon() && !scoreboardOpen()` and calls `openScoreboard()`. Restart and deck navigation already stop the game, which resets the state.

### 7. Compact layout with own rank
Chosen over a centered card and a bottom sheet. The dialog is narrow (about 340px, `max-width: calc(100vw - 32px)`), with a header row (trophy icon, title, close button), a muted subtitle "N tries in mm:ss", the top 10 as rows, and one "New game" button. The title is derived: find the row matching the just-saved score (same user, tries and `durationMs`) in the loaded top 10; if found, the title is "You're #index+1" and the row gets a highlight class; otherwise "Game won". When several rows are identical the first match is used. The matched row is derived from the loaded list and the saved score values, so it is stable across close and reopen. The table is replaced by a semantic list or table with compact rows; the top 10 stays complete and scrolls inside the dialog on short screens.

### 8. Page scroll
Add `dialog:modal { overscroll-behavior: contain }` and the same on `::backdrop` with `overflow: hidden`, instead of locking `body` scrolling. The table is capped with `max-height` and scrolls inside the dialog on small screens.

## Risks / Trade-offs

- [Safari lacks `closedby`] → pointer-based fallback; `Esc` and the button work regardless.
- [Exit animation fallback adds code] → isolate it in one small helper with a unit test; without it the dialog still closes, only abruptly.
- [Two sources of truth, signal and element] → the `close` event is the single write-back path; an effect only calls `showModal()`/`close()` when the element state differs from the signal.
- [Unit tests run in jsdom, where `showModal()` may be missing] → stub or polyfill `HTMLDialogElement` methods in the test setup.
- [E2E selectors use `#won` for "New game?"] → keep that id.

## Open Questions

None. The own-row highlight does not rely on color alone: the row is also bold, carries `aria-current="true"`, and the heading ("You're #N", a polite live region) names the rank. No extra visually hidden text is needed.
