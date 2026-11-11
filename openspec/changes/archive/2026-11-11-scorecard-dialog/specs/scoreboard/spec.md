# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

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
