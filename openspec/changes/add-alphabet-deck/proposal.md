# Proposal

## Why

The owner's son is learning the alphabet in first grade (Flanders). The memory game is a fun way to practise letters and sounds, but the existing decks (dinos, frameworks) only consist of pairs of identical cards. Linking letters to sounds needs a pair made of two different cards: the letter and a word that contains that sound.

## What Changes

- New deck **alfabet** with first-grade letters and sounds: vowels, consonants and two-letter sounds (aa, ee, oo, uu, ie, oe, eu, ui, ou, au, ei, ij, sch, ng, nk).
- Each pair consists of a **letter card** (the letter or sound in large, clear text) and a **word card** (a picture of a word containing the sound, with the word written below it; if the sound is not at the start of the word, those letters are highlighted).
- The game can now match pairs of **different** cards; two letter cards or two word cards never form a pair.
- Pairs are grouped into **phases** (following the Veilig leren lezen reading method); a deck can limit the game to a highest phase, so only letters the child already knows appear. The draft follows the kim version; the school's actual version is still unknown.
- A deck can limit the number of pairs per game, so the board stays playable for a child (e.g. 8 random pairs from the full alphabet).
- Existing decks (dinos, frameworks) keep working unchanged.

## Capabilities

### New Capabilities
- `alphabet-deck`: Content and presentation of the alphabet deck: which letters/sounds, which words, and what letter and word cards look like.
- `card-matching`: Rules for when two face-up cards form a pair, including pairs of different cards and a maximum number of pairs per game.

### Modified Capabilities
<!-- None: there are no specs in openspec/specs/ yet. -->

## Impact

- `src/assets/data.json`: new deck, new optional field for pairs and `pairsPerGame`.
- `src/app/game/playfield/model/deck.ts` and `model/board.ts`: extended with pair definition, pair key and card face.
- `src/app/game/playfield/services/game.service.ts`: board building and match check.
- `src/app/game/playfield/components/cards/card.component.*`: letter and word cards next to the existing image card.
- Unit tests for `game.service`, `card.component`, `deck.service`; possibly an e2e test.
- No new dependencies. No backend or Firestore changes.

## Assumptions

- Word pictures are emoji (no new SVG assets needed); the word is written below so the child also reads.
- The word list is a draft: the version of Veilig leren lezen and its key words are unknown. The parent will supply them later; replacing them in `data.json` needs no code change.
- Pronunciation/audio is out of scope.
