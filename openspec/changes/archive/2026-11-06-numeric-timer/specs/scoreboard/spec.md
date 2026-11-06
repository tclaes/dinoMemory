# Spec Delta

## MODIFIED Requirements

### Requirement: Winning score is saved
The system SHALL save the score (user, deck name, tries, time) of a won game to the `scores` collection exactly once per won game, when a user is signed in. The time SHALL be saved as a number of milliseconds in the `durationMs` field.

#### Scenario: Signed-in player wins
- **WHEN** a signed-in player wins a game
- **THEN** one score with their name, the deck name, the tries and the time is saved

#### Scenario: Time saved in milliseconds
- **WHEN** a signed-in player wins a game after 1 minute and 5.3 seconds
- **THEN** the saved score has `durationMs` set to the number 65300

#### Scenario: No user signed in
- **WHEN** a player without a signed-in user wins a game
- **THEN** no score is saved and the scoreboard is still shown

#### Scenario: Scoreboard re-renders
- **WHEN** the scoreboard re-renders without a new game being won
- **THEN** no additional score is saved

### Requirement: Top 10 per deck
The system SHALL show the 10 best scores of the current deck, ordered by fewest tries and then by the lowest `durationMs`. The time SHALL be shown in clock format. Scores of other decks, and scores saved without a `durationMs` value, SHALL NOT be shown.

#### Scenario: Ranking
- **WHEN** the scoreboard is shown for the deck "dinos"
- **THEN** at most 10 scores of the deck "dinos" are listed, fewest tries first

#### Scenario: Equal tries ranked by time
- **WHEN** two scores of the deck have the same number of tries and take 9000 and 10000 milliseconds
- **THEN** the 9000 ms score is listed above the 10000 ms score

#### Scenario: Same displayed second
- **WHEN** two scores of the deck have the same number of tries and take 9870 and 9120 milliseconds
- **THEN** both show `00:09` and the 9120 ms score is listed above the 9870 ms score

#### Scenario: Time column format
- **WHEN** a listed score has 65300 milliseconds
- **THEN** its time is shown as `01:05`

#### Scenario: Legacy score without durationMs
- **WHEN** the deck has an older score saved with only a text time and no `durationMs` value
- **THEN** that score is not listed

## REMOVED Requirements

### Requirement: Timer stops on win
**Reason**: Timer behavior now lives in the `game-timer` capability, which keeps the timer rules in one place and also specifies the exact winning moment.
**Migration**: Covered by "Final time frozen at the winning moment" in `game-timer`. The behavior is unchanged: the time stops when the game is won and the scoreboard keeps showing it.
