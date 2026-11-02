# Tasks

## 1. Verify the backend

- [x] 1.1 Check the Firestore rules for `scores` (console or emulator): an authenticated user can create and anyone can read. Verify by writing and reading a score through the emulator or console; if blocked, record the needed rule change in design.md before continuing.

## 1b. Dependencies and emulator

- [x] 1.2 Pin `firebase` to `^11.8.0` so only one Firestore copy exists. Verify: `npm ls firebase @firebase/firestore` shows a single deduped version; unit tests and build pass.
- [x] 1.3 Add the Firestore emulator to `firebase.json`, `playwright.config.ts`, the e2e environment and `app.config.ts`. Verify: e2e run writes to the emulator only.

## 2. Game state

- [x] 2.1 Guard `GameService.gameWon` with `board().length > 0`. Verify with a `game.service.spec.ts` case: empty board → `false`, all pairs matched → `true`.
- [x] 2.2 Stop the interval in `TimerService` when `gameWon()` is true, keeping the displayed time. Verify with a `timer.service.spec.ts` case: after a win, advancing fake timers does not change `currentTime()`.

## 3. Scoreboard component

- [x] 3.1 In `ScoreboardComponent`, restore `nrOfClicks` from `ClicksService.countedClicks` and the "tries" line. Verify: spec renders the tries and time.
- [x] 3.2 Implement `ngOnInit`: when a user is signed in call `updateScores(displayName, clicks, time, deck.name)`, then `loadScores(deck.name)` into `collection$`; remove the "Scores need to be fixed" log. Verify with specs: saved once with the right arguments when signed in, not saved without a user, `loadScores` called with the deck name.
- [x] 3.3 Implement `newGame()` as `GlobalService.stopGame()`. Verify: spec asserts `stopGame` is called; replaces the two `it.todo` specs.

## 4. Wiring

- [x] 4.1 Render `<app-scoreboard>` in `GameComponent` under `@if (gameService.gameWon())` and style it as an overlay. Verify with a `game.component.spec.ts` case: hidden when `gameWon` is false, shown when true.
- [x] 4.2 Add an e2e test against the emulator: play a full game as a signed-in user, see the scoreboard with the user's score, click "New game?" and see a fresh face-down board. Verify: the test passes in `npm run` e2e script.

## 5. Final check

- [x] 5.1 Run the full unit test suite and e2e suite and confirm they pass; manually win a game in the browser and confirm the scoreboard, saved score and restart.
