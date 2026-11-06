# Spec Delta

## Purpose

Defines the in-game timer: how it measures the elapsed time of a game, when it starts, stops, freezes and resets, and how that time is shown to the player.

## ADDED Requirements

### Requirement: Timer measures elapsed time
The system SHALL measure the time of a game as the number of milliseconds elapsed since the game started, based on the actual clock rather than on counting ticks.

#### Scenario: Counting time
- **WHEN** a game is started and 3 seconds pass
- **THEN** the elapsed time is 3000 milliseconds

#### Scenario: Throttled background tab
- **WHEN** a game is running and the page's timers are delayed (for example in a background tab) while 60 seconds pass on the clock
- **THEN** the elapsed time is 60000 milliseconds once the timer updates again

#### Scenario: Past one hour
- **WHEN** a game has been running for 1 hour, 0 minutes and 5 seconds
- **THEN** the elapsed time is 3605000 milliseconds

### Requirement: Final time frozen at the winning moment
When the game is won, the system SHALL stop the timer and freeze the elapsed time at the exact moment the game was won, not at the last timer update.

#### Scenario: Win between updates
- **WHEN** a game is won 3720 milliseconds after it started
- **THEN** the elapsed time is frozen at 3720 milliseconds

#### Scenario: Time stays frozen
- **WHEN** the game is won and several seconds pass
- **THEN** the elapsed time does not change
- **AND** the time on the scoreboard stays the same

### Requirement: Timer lifecycle
The timer SHALL be at zero and not running before a game starts, SHALL start from zero when a game starts or restarts, and SHALL reset to zero when the game is stopped.

#### Scenario: Before the game starts
- **WHEN** no game has started and 3 seconds pass
- **THEN** the elapsed time stays 0

#### Scenario: Restart
- **WHEN** a game has run for 2 seconds and is stopped and started again
- **THEN** the elapsed time is 0 and counts up from there

### Requirement: Time shown as a clock
The system SHALL display the elapsed time in whole seconds, rounded down, as `mm:ss` with two-digit minutes and seconds below one hour, and as `h:mm:ss` from one hour on.

#### Scenario: Below one minute
- **WHEN** the elapsed time is 5000 milliseconds
- **THEN** the time is shown as `00:05`

#### Scenario: Rounded down
- **WHEN** the elapsed time is 9870 milliseconds
- **THEN** the time is shown as `00:09`

#### Scenario: Minutes and seconds
- **WHEN** the elapsed time is 65000 milliseconds
- **THEN** the time is shown as `01:05`

#### Scenario: From one hour
- **WHEN** the elapsed time is 3723000 milliseconds
- **THEN** the time is shown as `1:02:03`

#### Scenario: Status bar
- **WHEN** a game is running
- **THEN** the status bar shows the current elapsed time in clock format
