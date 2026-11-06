# Tasks

## 1. Duration formatting

- [x] 1.1 Add a pure `formatDuration(ms)` in `src/app/game/game-status-bar/` that floors to whole seconds and returns `mm:ss` below one hour and `h:mm:ss` from one hour on. Verify with unit specs for 0 → `00:00`, 5000 → `00:05`, 9870 → `00:09`, 65000 → `01:05`, 3599999 → `59:59`, 3600000 → `1:00:00` and 3723000 → `1:02:03`.
- [x] 1.2 Add a standalone pure `duration` pipe that wraps `formatDuration`. Verify with a pipe spec that `65300` is shown as `01:05`.

## 2. Numeric timer

- [x] 2.1 Rework `TimerService` to expose `elapsedMs: Signal<number>` (a `linkedSignal` on `gameStarted$` resetting to `0`), measured as `Date.now() - startedAt` on each 1000 ms tick. Remove `currentTime`. Search for other uses of `resetTimer` and `intervalId`, then remove them or keep them private. Verify by updating `timer.service.spec.ts` to number assertions (start, no tick before start, single interval, stop resets, restart from zero).
- [x] 2.2 Freeze at the winning moment: when the effect sees `gameWon()`, set `elapsedMs` once more to `Date.now() - startedAt`, then clear the interval. Verify with a spec that advances 3720 ms, flips `gameWon`, and expects `3720`, unchanged after another 3000 ms, with `vi.getTimerCount()` at `0`.
- [x] 2.3 Add timer specs for drift and for durations past one hour: move the system time forward 60 s with `vi.setSystemTime`, advance a single tick and expect `60000`. Also run to 3605 s and expect `3605000`. Verify that `npm test` passes for the timer spec.
- [x] 2.4 Update `TimerComponent` to render `{{ elapsedMs() | duration }}`. Verify by updating `timer.component.spec.ts` to expect `00:00` → `00:01`.

## 3. Scores in milliseconds

- [x] 3.1 Change `Score` to `{ user, deck, clicks, durationMs: number }`. Make `updateScores` write `durationMs`, and make `loadScores` order by `clicks` then `durationMs`. Verify by updating `score.service.spec.ts` (expect `orderBy('durationMs')` and the saved data containing `durationMs` as a number, without `time`).
- [x] 3.2 Update `ScoreboardComponent` to pass `elapsedMs()` to `updateScores`, to show the result time with `| duration`, and to render the table time column as `score.durationMs | duration`. Verify by updating `scoreboard.component.spec.ts` (mock `elapsedMs: signal(30500)`, expect `00:30` on screen and `updateScores` called with `30500`).
- [x] 3.3 Add a TestBed spec with the real `TimerService` (and a mocked `GameService.gameWon`) that wins 3720 ms into a game and creates `ScoreboardComponent` in the same tick. Verify that `updateScores` receives `3720`, not `3000`. This covers the effect-ordering risk in design.md.
- [x] 3.4 Change the `scores` composite index in `firestore.indexes.json` to `deck, clicks, durationMs`. Verify that the JSON is valid and the field list matches the `loadScores` query order.

## 4. Integration

- [x] 4.1 Extend the winning test in `e2e/alfabet.spec.ts` to check that the result screen and the player's row show a time matching `/^\d{2}:\d{2}$/`. Verify that `npm run e2e` passes.
- [x] 4.2 Run `npm run lint` and the full unit suite. Verify both pass with no leftover references to the old timer (`grep -rn "currentTime\|0h - \|score.time" src e2e` returns nothing).

## Workflow follow-up

- Before or with the release, deploy the index with `firebase deploy --only firestore:indexes` and wait until it is built (`deploy.yml` only deploys hosting).
- Archive the change after review and merge.
