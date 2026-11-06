# Tasks

## 1. Data model and game logic

- [x] 1.1 Extend `Deck` with optional `pairs` (incl. `phase`, `highlight`), `pairsPerGame` and `maxPhase`, and `BoardCard` with `pairKey` and `face`. Verify: `npx tsc --noEmit` succeeds.
- [x] 1.2 Change board building in `GameService.board`: build from `pairs` (one letter and one word card per pair, first filtered on `maxPhase`, then limited to `pairsPerGame`, random and without duplicates), otherwise from `cards` as before. Verify: new tests in `game.service.spec.ts` for 16 cards from >8 pairs, no duplicates, stable board during a game, only pairs up to `maxPhase`.
- [x] 1.3 Change `#checkForMatch` to compare `pairKey`. Verify: tests for letter + right word (match), letter + wrong word (no match), two identical dino cards (match); existing game.service tests stay green.

## 2. Card rendering

- [x] 2.1 Make `CardComponent` render per `face.kind`: image (existing), letter (large text, aria-label with the letter) and word (emoji + word, with `highlight` marked). Verify: tests in `card.component.spec.ts` for each kind; existing tests stay green.
- [x] 2.2 Style the letter and word cards in `card.component.scss` (letter size, contrast, mobile). Verify: visual check of the board on desktop and mobile width (<800px) via `npm start`.

## 3. Alphabet deck

- [x] 3.1 Add the "alfabet" deck to `src/assets/data.json` with the draft word list from design.md (phases 1–3, `pairsPerGame: 8`, `maxPhase: 1`). Verify: data test that each letter/sound occurs at most once, every word contains the sound and `highlight` (if present) occurs in the word.
- [x] 3.2 Check that the deck appears in the navigation and can be selected. Verify: updated `deck.service.spec.ts`/`navigation.component.spec.ts`.

## 4. Wrap-up

- [x] 4.1 Run the full test suite and lint. Verify: `npm test`, `npm run lint` succeed.
- [x] 4.2 Play the alphabet deck manually in the browser: letter + word matches, two letters do not, a new game gives different pairs, the dinos deck still works. Verify: visual check.
