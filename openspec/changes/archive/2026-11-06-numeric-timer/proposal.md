# Proposal

## Why

The game timer is a preformatted string (`0h - 1m - 5s`) built by counting `setInterval` ticks, and that string is what gets saved and sorted in Firestore. This causes three real bugs: the top 10 ranks times alphabetically (`10s` before `9s`), the minutes never reset after 59m59s, and the time drifts behind when the browser throttles a background tab. Whole-second precision also leaves frequent ties between players with equal tries.

## What Changes

- The timer measures elapsed time as a number of milliseconds since the game started, derived from the clock rather than from counting ticks. When the game is won, the final time is the exact moment of the last match, not the last tick.
- The time is shown in whole seconds (rounded down) as a clock: `mm:ss` (e.g. `01:05`), and `h:mm:ss` from one hour on (e.g. `1:02:03`), in the status bar, on the result screen and in the top 10 table.
- A saved score stores the time as a number of milliseconds in a new `durationMs` field instead of the `time` string. Ties within the same displayed second are then ranked by the faster player. **BREAKING** (data): the top 10 is ordered by `durationMs`, so existing scores that only have the `time` string no longer appear in the top 10. No migration.
- The Firestore composite index for `scores` changes from `deck, clicks, time` to `deck, clicks, durationMs`.

## Capabilities

### New Capabilities
- `game-timer`: How the in-game timer measures elapsed time, when it starts, stops, freezes and resets, and how the time is displayed.

### Modified Capabilities
- `scoreboard`: "Winning score is saved" stores the time as milliseconds; "Top 10 per deck" orders by that numeric time, shows it in clock format and leaves out scores without it. "Timer stops on win" is removed here and moves to `game-timer`.

## Impact

- Code: `game/game-status-bar/services/timer.service.ts`, `game/game-status-bar/components/timer/`, `game/scoreboard/score.service.ts`, `game/scoreboard/scoreboard.component.ts`, and their specs.
- Data: `scores` documents get `durationMs: number` instead of `time: string`. Old documents stay in the collection but are no longer ranked.
- Firestore: `firestore.indexes.json` changes. The new index must be deployed before or together with the app, otherwise the top 10 query fails.
- Out of scope: migrating or deleting old scores, showing sub-second time, pausing the timer.
