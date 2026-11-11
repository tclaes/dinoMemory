# Tasks

## 1. Scoreboard open state

- [x] 1.1 Add `scoreboardOpen`, `openScoreboard()` and `closeScoreboard()` to `GameService` (open on win, reset when the game stops) and verify with new cases in `game.service.spec.ts` for win, close, reopen and stop

## 2. Dialog component

- [x] 2.1 Rewrite `ScoreboardComponent` around a modal `<dialog>` (heading with `aria-labelledby`, close button in a `<form method="dialog">`, `autofocus` on "New game?", keep `id="won"`), synced with `scoreboardOpen` via `showModal()`/`close()` and the `close` event; verify `scoreboard.component.spec.ts` covers open, close by button, close event writing back, and score saved once across close and reopen
- [x] 2.2 Add the rank title ("You're #N" / "Game won"), the tries-and-time subtitle and the highlighted own row, derived from the loaded top 10 and the saved score; verify with component tests for in top 10, outside top 10, no user, and after close and reopen
- [x] 2.3 Set `closedby="any"` and add the feature-detected pointer fallback for browsers without it; verify with a unit test that a press and release outside closes it, and a click on padding does not
- [x] 2.4 Replace the overlay styles in `scoreboard.component.scss` with dialog styles: `::backdrop`, `overscroll-behavior` containment, `max-height` with inner scroll; verify visually at desktop and 375px width
- [x] 2.5 Add the fade/scale transition with `@starting-style`, `overlay` and `allow-discrete`, reduced-motion handling, and the `data-closing` exit fallback helper; verify the helper with a unit test and check the animation in Chromium and Firefox

## 3. Reopening from the status bar

- [x] 3.1 Add a "Show scores" button to `GameStatusBarComponent`, visible only when the game is won and the scoreboard is closed; verify with `game-status-bar.component.spec.ts` for visible, hidden while open, hidden during play
- [x] 3.2 Confirm `game.component.html` keeps the scoreboard mounted for the whole won game and that restart or opening another deck resets it; verify with `game.component.spec.ts`

## 4. End to end and spec

- [x] 4.1 Extend `e2e/alfabet.spec.ts`: win a game, close with `Esc`, reopen with "Show scores", close by clicking outside, then start a new game; verify with `npm run e2e`
- [x] 4.2 Run `npm run lint`, the unit tests and `openspec validate scorecard-dialog --strict`; verify all pass

## Workflow follow-up

- Archive the change once implemented and reviewed.
