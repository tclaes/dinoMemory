# alphabet-deck Specification

## Purpose
Defines the "alfabet" deck: its place in the deck navigation, its first-grade letter and sound content, the highlighting of sounds inside words, the phases that limit which pairs are used, and how the letter and word cards look.

## Requirements

### Requirement: Alphabet deck available
The system SHALL offer a deck named "alfabet" alongside the existing decks, selectable through the same navigation.

#### Scenario: Deck visible in navigation
- **WHEN** the decks have loaded
- **THEN** "alfabet" is in the list of available decks

#### Scenario: Selecting the deck
- **WHEN** the user chooses "alfabet"
- **THEN** the board shows the cards of the alphabet deck

### Requirement: Content follows the first-grade curriculum
The alphabet deck SHALL contain pairs for the letters and sounds taught in the first grade, including the two-letter sounds aa, ee, oo, uu, ie, oe, eu, ui, ou, au, ei, ij, sch, ng and nk. Each pair SHALL have its own word that contains the letter or sound.

#### Scenario: No duplicate letters
- **WHEN** the deck is loaded
- **THEN** each letter or sound appears as a pair at most once

#### Scenario: Word contains the sound
- **WHEN** a pair is inspected
- **THEN** the word on the word card contains the letter or sound of the letter card

### Requirement: Sound highlighted in the word
When the sound is not at the start of the word, the pair SHALL specify which letters in the word belong to the sound, and the word card SHALL visibly highlight those letters.

#### Scenario: Sound in the middle of a word
- **WHEN** the pair "ie" with the word "vlieg" shows a word card
- **THEN** the letters "ie" in "vlieg" are visibly highlighted

### Requirement: Phases
Each pair SHALL belong to a phase, and the deck MAY specify a highest phase. The system SHALL only treat pairs from phases up to and including that highest phase as eligible for a game. Without a specified highest phase, all pairs are eligible. The maximum number of pairs per game, if any, is applied to the eligible pairs only.

#### Scenario: Limited to a phase
- **WHEN** the highest phase is 1 and a new game starts
- **THEN** only pairs from phase 1 appear on the board

#### Scenario: No highest phase
- **WHEN** the deck does not specify a highest phase
- **THEN** all pairs are eligible

### Requirement: Letter card
The letter card SHALL show the letter or sound in lowercase, in a large, easily readable typeface.

#### Scenario: Letter shown
- **WHEN** a letter card is face up
- **THEN** the letter or sound is visible as text and the card has an accessible name containing that letter

### Requirement: Word card
The word card SHALL show a picture of the word with the word written below it.

#### Scenario: Word shown
- **WHEN** a word card is face up
- **THEN** the picture and the word are visible
