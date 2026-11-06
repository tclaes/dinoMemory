# Design

## Context

`TimerService` (`game/game-status-bar/services/timer.service.ts`) holds a `linkedSignal<string>` that resets on `gameStarted$` and is updated by a 1s `setInterval` that increments local `hours/minutes/seconds` counters. An `effect` starts the interval when the game is started and not won, and stops it otherwise. The string is read by `TimerComponent`, by `ScoreboardComponent` (shown on the result screen and passed to `ScoreService.updateScores` in `ngOnInit`), and ordered on in Firestore (`orderBy('clicks')`, `orderBy('time')`, composite index `deck, clicks, time`). See proposal.md for the bugs this causes.

## Goals / Non-Goals

**Goals:**
- One numeric source of truth for elapsed time in milliseconds, accurate under timer throttling.
- A final time that reflects the winning moment, so millisecond ranking is real and not a multiple of 1000.
- Formatting in a single pure function, reused by every place that shows a time.
- Keep the public surface of `TimerService` small and the existing start/stop/won behavior intact.

**Non-Goals:**
- Showing sub-second time anywhere in the UI.
- Migrating, rewriting or deleting old `scores` documents.
- Pausing/resuming the timer.

## Decisions

### Elapsed milliseconds derived from a start timestamp
On start, record `startedAt = Date.now()`. Every tick sets `elapsedMs = Date.now() - startedAt`. The interval stays at 1000 ms and only triggers a refresh; it is no longer the measurement. Because it starts at `startedAt`, the display moves on each whole second, and a throttled tab shows the correct value as soon as a tick fires.
- *Alternative*: keep incrementing a counter per tick → still drifts, rejected.
- *Alternative*: `performance.now()` → monotonic, but `vi.useFakeTimers()` mocks `Date` by default, which keeps the existing fake-timer specs simple. Wall-clock jumps (an OS clock change mid-game) are an acceptable edge case.

### Freeze at the winning moment
When the existing `effect` sees `gameWon()` become true, it does one final `elapsedMs.set(Date.now() - startedAt)` before clearing the interval. Without that final read, the frozen value would be the last tick (a multiple of 1000), and storing milliseconds would add no information. On a plain stop (`gameStarted$` false), the `linkedSignal` resets to `0` as it does today, so no final read is needed there.
- *Alternative*: have `GameService` call a `TimerService.stop()` synchronously on the last match → exact to the millisecond, but `TimerService` already injects `GameService`, so this would create a circular dependency. The effect runs within the same change-detection pass, so the delay is a few ms at most. Rejected.

### `TimerService` exposes `elapsedMs: Signal<number>`
Replace `currentTime: Signal<string>` with `elapsedMs`. It stays a `linkedSignal` on `gameStarted$` resetting to `0`. `resetTimer()` and the public `intervalId` field go, if nothing outside the service uses them (verify with a search while implementing).

### Pure `formatDuration(ms: number): string`
A standalone function (e.g. `game/game-status-bar/format-duration.ts`) floors to whole seconds, then returns `mm:ss` below one hour and `h:mm:ss` from one hour on. It is wrapped in a small standalone pipe (`duration`) so templates can write `{{ ms | duration }}`. A pure pipe re-runs only when its input changes.
- *Alternative*: a `computed` string on the service → doesn't help the scoreboard table rows, which format stored values. A pipe covers both.

### Score stored as `durationMs: number`, `time` dropped
`Score` becomes `{ user, deck, clicks, durationMs }`. `updateScores` writes `durationMs`. `loadScores` orders by `clicks` then `durationMs`. Firestore leaves out documents missing an `orderBy` field, so old string-only scores drop out of the top 10 on their own, as the user chose. `firestore.indexes.json` gets `deck, clicks, durationMs`. The unit is in the field name so it can't be mistaken for seconds later.
- *Alternative*: reuse the `time` field with a number → mixed types in one field. Firestore sorts numbers before strings, so old scores would linger at the bottom. Rejected.
- *Alternative*: store whole seconds → frequent ties within the same second, which led to this choice. Rejected.

The existing `startAt(0)` / `endAt(100)` act on the first `orderBy` (`clicks`) and stay unchanged.

## Risks / Trade-offs

- [`ScoreboardComponent.ngOnInit` reads `elapsedMs()` before the timer effect has written the final value, so a last-tick value gets saved] → Angular runs root effects (the service's `effect`) before refreshing views in the same tick, so the frozen value is in place when the scoreboard is created. Cover this with a TestBed spec that uses the real `TimerService` and a `gameWon` flip between ticks, and expects the value not to be a multiple of 1000 when read right after.
- [Two rows show the same `00:09` but in a fixed order] → Accepted. The order is correct by milliseconds, and the UI stays a clean clock.
- [The new composite index is missing in production, so the top 10 query fails with `failed-precondition`] → Deploy `firestore.indexes.json` (`firebase deploy --only firestore:indexes`) before or with the release. `deploy.yml` only deploys hosting, so this is a manual step. The emulator used by e2e doesn't need indexes.
- [Old scores vanish from the top 10] → Accepted by the user. The data stays in Firestore, and a migration is still possible later.
- [Clock-based measurement depends on `Date`, so spec fake timers must mock `Date`] → `vi.useFakeTimers()` does this by default. Use `vi.setSystemTime` / `vi.advanceTimersByTime` to cover throttling and the between-ticks win.

## Migration Plan

1. Merge and deploy the index change (`firebase deploy --only firestore:indexes`), then wait until the index shows as built.
2. Deploy the app (master → live via `deploy.yml`).
3. Rollback: redeploy the previous app version. The old `deck, clicks, time` index can stay alongside, since both indexes may exist at the same time. Scores saved during the new version only have `durationMs` and won't show in the old version's top 10.
