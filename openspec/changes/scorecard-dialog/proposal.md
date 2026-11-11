# Proposal

## Why

The scoreboard that appears after winning a game is a fixed full-screen overlay that cannot be closed. The player can only leave it by pressing "New game?", restarting, or navigating to another deck, so the finished board underneath is unreachable and the top 10 cannot be looked at again once it is gone. The platform now offers a native modal `<dialog>` that gives dismissal, focus handling and accessibility for free.

## What Changes

- Show the scoreboard as a native modal `<dialog>` instead of a hand-built fixed overlay.
- Let the player close it with the `Esc` key, a click outside the dialog, or a visible close button.
- After closing, keep the won board visible with the timer frozen; the game stays in its "won" state.
- Add a "Show scores" button to the game status bar that reopens the scoreboard while a game is won and the scoreboard is closed.
- Use a compact layout: a title with the player's rank ("You're #2"), tries and time as a subtitle, the top 10 with the player's own row highlighted, and a single "New game" button.
- Fade and scale the dialog in and out, respecting `prefers-reduced-motion`.
- The score is still saved exactly once per won game, whether or not the scoreboard is open.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `scoreboard`: the scoreboard becomes a dismissible modal dialog that can be reopened; showing it on a win stays, saving and ranking stay unchanged.

## Impact

- `src/app/game/scoreboard/scoreboard.component.ts` and `.scss`: rewritten around `<dialog>`.
- `src/app/game/playfield/services/game.service.ts`: new open/closed state for the scoreboard, reset when the game stops.
- `src/app/game/game-status-bar/`: new "Show scores" control.
- `src/app/game/playfield/components/page/game.component.html`: renders the scoreboard for the whole won game.
- Unit specs for the scoreboard, game service and status bar; `e2e/alfabet.spec.ts` for the close and reopen flow.
- No new dependencies. Out of scope: changing how scores are saved, ranked or timed.
