# deck-navigation Specification

## Purpose
Defines the deck navigation in the header of a signed-in player: which decks it lists, how choosing a deck opens the game with that deck from any page, the address of each deck, and how the current deck is marked.

## Requirements

### Requirement: Navigation lists the available decks as links
The header navigation, labelled "Choose a card set", SHALL show one item per available deck, named after the deck. Each item SHALL be a link to the address of that deck, not a button.

#### Scenario: Decks listed as links
- **WHEN** a signed-in player views any page and the decks have loaded
- **THEN** the navigation "Choose a card set" contains a link for every available deck, such as "dinos" and "alfabet"
- **AND** the navigation contains no buttons for choosing a deck

#### Scenario: Link address
- **WHEN** the player inspects the link "alfabet"
- **THEN** it points to `/game/alfabet`

### Requirement: Choosing a deck opens the game from any page
Choosing a deck in the navigation SHALL show the game page with the board of that deck, whichever page the player is on.

#### Scenario: From the profile page
- **WHEN** a signed-in player on the profile page chooses "alfabet" in the navigation
- **THEN** the game page is shown at `/game/alfabet`
- **AND** the board shows the cards of the alphabet deck

#### Scenario: From the game page
- **WHEN** the player is playing "dinos" and chooses "frameworks" in the navigation
- **THEN** the board shows the cards of the frameworks deck

### Requirement: Deck address selects the deck
Opening the address `/game/<deck name>` SHALL show the game with that deck. Opening `/` SHALL show the game with the default deck "dinos". Opening the address of a deck that does not exist SHALL send the player to `/`.

#### Scenario: Direct address
- **WHEN** a signed-in player opens `/game/alfabet` directly or reloads that page
- **THEN** the board shows the cards of the alphabet deck

#### Scenario: Default deck
- **WHEN** a signed-in player opens `/`
- **THEN** the board shows the cards of the dinos deck

#### Scenario: Unknown deck
- **WHEN** a signed-in player opens `/game/unknown`
- **THEN** the player is sent to `/`
- **AND** the board shows the cards of the dinos deck

### Requirement: Opening a deck starts a new game
Opening a deck through the navigation or its address SHALL start a new game: no cards are face up or matched, and the timer and the number of tries start from zero.

#### Scenario: Choosing the shown deck again
- **WHEN** the player has flipped cards in a running game and chooses the link of the deck that is shown
- **THEN** the board has no face-up or matched cards
- **AND** the timer and the tries counter are back at zero

#### Scenario: Switching deck mid-game
- **WHEN** the player has flipped cards in a running game and chooses another deck
- **THEN** the new board has no face-up or matched cards
- **AND** the timer and the tries counter are back at zero

### Requirement: Current deck is marked
The navigation link of the deck that is shown on the game page SHALL be marked as the current page for assistive technology and SHALL look visibly different from the other deck links. On pages other than the game page, no deck link SHALL be marked as current.

#### Scenario: Deck shown
- **WHEN** the game page shows the alphabet deck
- **THEN** the link "alfabet" has `aria-current="page"` and the active style
- **AND** the other deck links do not

#### Scenario: Profile page
- **WHEN** the player is on the profile page
- **THEN** no deck link has `aria-current="page"`

### Requirement: Logout stays a button
The "Bye!" control in the header SHALL remain a button, because it signs the player out rather than leading to a page.

#### Scenario: Logout control
- **WHEN** a signed-in player views the header
- **THEN** "Bye!" is a button and choosing it signs the player out
