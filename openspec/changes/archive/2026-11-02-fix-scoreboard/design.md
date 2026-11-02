# Design

## Context

Since commit `0896b51` the game state is signal-based: `GameService` (board, `matchedIds`, `gameWon`), `GlobalService` (`gameStarted$`, `startGame`/`stopGame`), `ClicksService.countedClicks` and `TimerService.currentTime`. Restarting is `GlobalService.stopGame()`; the `linkedSignal`s in the game, clicks and timer services reset when `gameStarted$` flips to `false`.

The scoreboard pieces still exist but are disconnected:
- `ScoreboardComponent` has its wiring commented out and is not used in any template.
- `GameService.gameWon` is `matchedIds().size === board().length`; this is `true` for an empty board.
- `ScoreService.loadScores(deck)` and `updateScores(user, clicks, time, deck)` are unchanged and tested; nothing calls `updateScores`.
- `GameService.deck` is now a `Signal<Deck | undefined>`, while the service expects the deck name (string).
- `TimerService` only stops when `gameStarted$` becomes `false`, so it keeps counting after a win.
- The repo has `firestore.indexes.json` (deck, clicks, time) but no `firestore.rules`.

## Goals / Non-Goals

**Goals:**
- Reconnect the existing scoreboard to the signal-based game flow with minimal new code.
- Save one score per won game; show the per-deck top 10.

**Non-Goals:**
- Redesigning the scoreboard UI or the score data model.
- Changing how scores are ranked (see Risks).
- Adding Firestore security rules to the repo.

## Decisions

**1. Render the scoreboard from `GameComponent` with `@if (gameService.gameWon())`.**
`GameComponent` already owns the page layout (status bar + deck). Alternative: render it from `DeckComponent`; rejected because the deck should only render cards. Because the component is created when the game is won and destroyed on restart, `ngOnInit` runs exactly once per won game, which is where the score is saved.

**2. Guard `gameWon` with `board().length > 0`.**
Cheaper and more local than adding a separate "loaded" flag; fixes the false positive before the deck loads.

**3. `ScoreboardComponent.ngOnInit` saves, then loads.**
It calls `updateScores(user.displayName, clicks, time, deck.name)` only if a user is signed in, then `loadScores(deck.name)`. Inputs come from `GameService.user`/`deck`, `ClicksService.countedClicks` and `TimerService.currentTime` via `inject()`, matching the existing component. Alternative: an `effect()` on `gameWon`; rejected because effects can re-run and double-save, while component lifecycle gives "once" for free.

**4. Freeze the timer on win inside `TimerService`.**
Its existing `effect` also reads `GameService.gameWon()` and stops the interval when true; the displayed value is kept. No new dependency cycle (`GameService` does not inject `TimerService`). Alternative: a `finishGame()` on `GlobalService`; rejected because it would also reset the linked signals' semantics (`gameStarted$` false means reset).

**5. "New game?" calls `GlobalService.stopGame()`.**
Same path as the existing restart button, so board reshuffle, clicks and timer reset behave identically; `gameWon` becomes false and the scoreboard is removed.

**6. Show tries again** by re-enabling the commented line with `ClicksService.countedClicks`.

**7. Align `firebase` with `@angular/fire` (`^11.8`).**
`firebase@12` at top level made `rxfire` (used by `collectionData`) resolve to Firestore 12 while `@angular/fire@20` built queries with its nested Firestore 11, failing at runtime with `Expected type 'Query$1'`. Pinning `firebase` to `^11.8.0` (the `@angular/fire@20` peer range) leaves one Firestore copy. The peer range `@firebase/app@0.x` also left a stale `0.16.1` next to firebase 11's `0.13.2` (runtime error `No Firebase App`), so `overrides` pins `@firebase/app` to `0.13.2`. Alternatives: upgrade `@angular/fire` to the 22 RC (riskier), or `overrides` (workaround).

**8. Firestore emulator for e2e.**
`firebase.json`/`playwright.config.ts` start the Firestore emulator and the e2e environment sets `firestoreEmulator`, so e2e never writes scores to the real database.

## Risks / Trade-offs

- [Time is stored as a string like `0h - 10m - 3s`, so ordering by `time` is lexicographic and wrong across digit counts] → Out of scope; ranking is primarily by clicks. Follow-up: store a numeric `seconds` field and update the index.
- [Unknown Firestore rules in the console may block reads/writes of `scores`; that could also be part of the original breakage] → First implementation task verifies with the Firebase emulator/console; if blocked, fix the rules (and add `firestore.rules` to the repo as a separate decision).
- [Saving happens on the client, so scores can be forged] → Pre-existing; accepted for this game.
- [Offline persistence is enabled (`enableIndexedDbPersistence`); `addDoc` resolves later when offline] → The UI does not wait on the write; the list updates through `collectionData` when it syncs.

## Open Questions

- Should the scoreboard be a modal over the board (the unused `GameWonDirective` adds a `modal` class) or replace the board? Defaults to an overlay using the existing styles; purely visual.
