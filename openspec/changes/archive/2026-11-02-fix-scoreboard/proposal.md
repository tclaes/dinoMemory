# Proposal

## Why

The scoreboard no longer works. After the game's refactor to signals (commit `0896b51`), the scoreboard wiring was "parked": `ScoreboardComponent` no longer loads scores (`ngOnInit` only logs "Scores need to be fixed"), the clicks line is commented out, and `newGame()` is empty. On top of that, nothing renders `ScoreboardComponent` any more, `GameService.gameWon` is never read, and `ScoreService.updateScores()` is never called. A player who wins sees nothing: no "Game Won" screen, no ranking, and no score is saved.

## What Changes

- Show the scoreboard when the game is won (`GameService.gameWon`), on top of / in place of the board.
- Guard `gameWon` so it is not `true` for an empty board (`0 === 0` before the deck has loaded).
- Save the winning score (user, deck name, clicks, time) exactly once per won game, only when a user is signed in.
- Load and show the top 10 scores for the current deck, ordered by clicks, then time.
- Show the number of tries again, and make the "New game?" button restart the game (`GlobalService.stopGame()`).
- Freeze the timer when the game is won so the displayed time is the final time.
- Re-enable the parked specs (`it.todo`) and add specs/e2e coverage for the win flow.

## Capabilities

### New Capabilities
- `scoreboard`: What happens when a game is won: the result screen, saving the score, the per-deck top 10, and starting a new game from it.

### Modified Capabilities
<!-- None: openspec/specs has no existing capabilities. -->

## Impact

- Code: `src/app/game/scoreboard/*`, `src/app/game/playfield/services/game.service.ts`, `src/app/game/playfield/components/page/game.component.*`, `src/app/game/game-status-bar/services/timer.service.ts`.
- Data: Firestore `scores` collection (existing; composite index on `deck`, `clicks`, `time` already in `firestore.indexes.json`). No schema change.
- Security: the repo has no `firestore.rules`; the rules that apply to `scores` live outside the repo and must be checked (see design).
- No new dependencies.
