# scoreboard Specification

## Purpose
Defines what happens when a memory game is won: the result screen with tries and time, saving the winning score, the per-deck top 10, and starting a new game from the result screen.

## Requirements

### Requirement: Scoreboard shown when the game is won
The system SHALL show the scoreboard as a modal dialog as soon as every card on a non-empty board is matched. The scoreboard SHALL show the number of tries and the final time of the game that was just won.

#### Scenario: Last pair matched
- **WHEN** the player matches the last remaining pair
- **THEN** the scoreboard appears as a modal dialog with the number of tries and the time of that game

#### Scenario: Board not loaded yet
- **WHEN** the deck has not loaded and the board is empty
- **THEN** the scoreboard is not shown

#### Scenario: Page behind the dialog
- **WHEN** the scoreboard is open
- **THEN** the rest of the page cannot be interacted with and the dialog is announced to assistive technology with its title

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

### Requirement: Own result highlighted in the ranking
The scoreboard SHALL title itself with the player's rank when the score of the game just won is in the shown top 10 ("You're #N"), and with "Game won" otherwise. In the first case the player's own row SHALL be visually highlighted, and the tries and time SHALL be shown in a subtitle below the title.

#### Scenario: Score makes the top 10
- **WHEN** a signed-in player wins with the second-best score of the deck
- **THEN** the title reads "You're #2", the second row is highlighted and the subtitle shows the tries and time

#### Scenario: Score outside the top 10
- **WHEN** a signed-in player wins with a score that is not among the 10 best
- **THEN** the title reads "Game won", no row is highlighted and the subtitle shows the tries and time

#### Scenario: No user signed in
- **WHEN** a player without a signed-in user wins
- **THEN** the title reads "Game won" and no row is highlighted

#### Scenario: Highlight survives reopening
- **WHEN** the player closes the scoreboard and reopens it
- **THEN** the same rank and highlighted row are shown

### Requirement: Scoreboard can be closed
The system SHALL let the player close the open scoreboard with the `Esc` key, by clicking or tapping outside the dialog, or with a visible close button in its header. Closing SHALL NOT start a new game.

#### Scenario: Close with Escape
- **WHEN** the scoreboard is open and the player presses `Esc`
- **THEN** the scoreboard closes

#### Scenario: Close by clicking outside
- **WHEN** the scoreboard is open and the player clicks outside the dialog
- **THEN** the scoreboard closes

#### Scenario: Click inside does not close
- **WHEN** the scoreboard is open and the player clicks on the dialog's content or padding
- **THEN** the scoreboard stays open

#### Scenario: Close with the close button
- **WHEN** the player activates the close button of the scoreboard
- **THEN** the scoreboard closes

#### Scenario: Game stays won
- **WHEN** the player closes the scoreboard
- **THEN** the board stays visible with every card matched, and the tries and time stay frozen

### Requirement: Scoreboard can be reopened
While a game is won and the scoreboard is closed, the system SHALL show a "Show scores" action in the game status bar that opens the scoreboard again with the tries, time and top 10 of that game.

#### Scenario: Reopen after closing
- **WHEN** the player closed the scoreboard and activates "Show scores"
- **THEN** the scoreboard opens again with the same tries and time

#### Scenario: Not offered while open or during play
- **WHEN** the scoreboard is open, or the game is not won
- **THEN** no "Show scores" action is available

#### Scenario: Gone after a new game
- **WHEN** the player starts a new game, restarts, or opens another deck
- **THEN** the scoreboard is closed, no "Show scores" action is available, and the next win opens the scoreboard again

### Requirement: Closing does not affect the saved score
Closing or reopening the scoreboard SHALL NOT save an additional score, and the score of a won game SHALL be saved once even if the scoreboard was closed.

#### Scenario: Close and reopen
- **WHEN** the player wins, closes the scoreboard and reopens it
- **THEN** exactly one score was saved for that game

### Requirement: Scoreboard motion respects user preference
The scoreboard SHALL fade and scale in and out when it opens and closes. For players who prefer reduced motion, it SHALL only fade, quickly, without scaling.

#### Scenario: Default motion
- **WHEN** the scoreboard opens or closes and the player has no reduced-motion preference
- **THEN** it fades and scales instead of appearing or disappearing at once

#### Scenario: Reduced motion
- **WHEN** the scoreboard opens or closes and the player prefers reduced motion
- **THEN** it only fades, without scaling
