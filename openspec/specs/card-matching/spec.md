# card-matching Specification

## Purpose
Defines how cards are matched into pairs: pairs of different cards that share a pair key, one card per side on the board, and the optional maximum number of pairs picked per game.

## Requirements

### Requirement: Pairs of different cards
The system SHALL treat two face-up cards as a pair when they have the same pair key and are different sides of that pair. For decks without defined pairs, a pair SHALL consist of two identical cards, as before.

#### Scenario: Letter and its word
- **WHEN** the letter card "b" and the word card "bal" are face up
- **THEN** both cards stay face up and count as a found pair

#### Scenario: Letter and wrong word
- **WHEN** the letter card "b" and the word card "kat" are face up
- **THEN** both cards are turned face down again after a short delay

#### Scenario: Existing deck unchanged
- **WHEN** two cards showing the same dinosaur are face up in the dinos deck
- **THEN** they form a pair

### Requirement: One card per side
For decks with defined pairs, the board SHALL contain exactly one letter card and one word card per pair.

#### Scenario: Board built
- **WHEN** a game starts with the alphabet deck and 8 pairs
- **THEN** the board has 16 cards: 8 letter cards and 8 word cards, in random order

### Requirement: Maximum number of pairs per game
A deck MAY specify a maximum number of pairs per game. The system SHALL then pick that many pairs at random from the eligible pairs of the deck for each new game; the eligible pairs are those left after any phase limit has been applied. Without a maximum, all eligible pairs are used.

#### Scenario: Subset chosen
- **WHEN** the alphabet deck has more pairs than the maximum and a new game starts
- **THEN** the board contains only the maximum number of pairs, without duplicates

#### Scenario: Phase limit and maximum together
- **WHEN** a highest phase leaves more eligible pairs than the maximum and a new game starts
- **THEN** the board contains the maximum number of pairs, all from the eligible phases

#### Scenario: Fewer eligible pairs than the maximum
- **WHEN** a highest phase leaves fewer eligible pairs than the maximum and a new game starts
- **THEN** the board contains all eligible pairs

#### Scenario: Board stable during a game
- **WHEN** a game is in progress
- **THEN** the composition of the board does not change
