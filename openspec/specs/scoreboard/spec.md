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

### Requirement: Timer stops on win
The system SHALL stop the timer when the game is won, so the displayed time no longer changes.

#### Scenario: Time frozen
- **WHEN** the game is won and several seconds pass
- **THEN** the time on the scoreboard stays the same

### Requirement: Winning score is saved
The system SHALL save the score (user, deck name, tries, time) of a won game to the `scores` collection exactly once per won game, when a user is signed in.

#### Scenario: Signed-in player wins
- **WHEN** a signed-in player wins a game
- **THEN** one score with their name, the deck name, the tries and the time is saved

#### Scenario: No user signed in
- **WHEN** a player without a signed-in user wins a game
- **THEN** no score is saved and the scoreboard is still shown

#### Scenario: Scoreboard re-renders
- **WHEN** the scoreboard re-renders without a new game being won
- **THEN** no additional score is saved

### Requirement: Top 10 per deck
The system SHALL show the 10 best scores of the current deck, ordered by fewest tries and then by time. Scores of other decks SHALL NOT be shown.

#### Scenario: Ranking
- **WHEN** the scoreboard is shown for the deck "dinos"
- **THEN** at most 10 scores of the deck "dinos" are listed, fewest tries first

### Requirement: New game from the scoreboard
The scoreboard SHALL offer a "New game?" action that hides the scoreboard and starts a fresh game with a reshuffled board, zero tries and a reset timer.

#### Scenario: Start a new game
- **WHEN** the player chooses "New game?" on the scoreboard
- **THEN** the scoreboard disappears and the board is reshuffled with all cards face down
- **AND** tries and time are reset to zero
