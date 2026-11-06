# scoreboard Specification

## Purpose
Defines what happens when a memory game is won: the result screen with tries and time, saving the winning score, the per-deck top 10, and starting a new game from the result screen.

## Requirements

### Requirement: Scoreboard shown when the game is won
The system SHALL show the scoreboard as soon as every card on a non-empty board is matched. The scoreboard SHALL show the number of tries and the final time of the game that was just won.

#### Scenario: Last pair matched
- **WHEN** the player matches the last remaining pair
- **THEN** the scoreboard appears with the number of tries and the time of that game

#### Scenario: Board not loaded yet
- **WHEN** the deck has not loaded and the board is empty
- **THEN** the scoreboard is not shown

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

### Requirement: New game from the scoreboard
The scoreboard SHALL offer a "New game?" action that hides the scoreboard and starts a fresh game with a reshuffled board, zero tries and a reset timer.

#### Scenario: Start a new game
- **WHEN** the player chooses "New game?" on the scoreboard
- **THEN** the scoreboard disappears and the board is reshuffled with all cards face down
- **AND** tries and time are reset to zero
