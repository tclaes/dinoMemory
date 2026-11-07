# Spec Delta

## MODIFIED Requirements

### Requirement: Alphabet deck available
The system SHALL offer a deck named "alfabet" alongside the existing decks, selectable through the same navigation.

#### Scenario: Deck visible in navigation
- **WHEN** the decks have loaded
- **THEN** "alfabet" is in the list of available decks

#### Scenario: Selecting the deck
- **WHEN** the user chooses the link "alfabet" in the navigation, or opens `/game/alfabet`
- **THEN** the board shows the cards of the alphabet deck
