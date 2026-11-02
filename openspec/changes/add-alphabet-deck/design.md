# Design

## Context

See proposal.md for motivation. Current state:

- `Deck` (`model/deck.ts`) has `cards: string[]`; `GameService.board` creates two `BoardCard`s per name (`{id, name, coverIndex}`) and `#checkForMatch` compares `first.name === second.name`.
- `CardComponent` always shows `assets/img/{imgURL}/{name}.svg` as its front.
- Decks come from `src/assets/data.json` via `DeckService`; the navigation shows all decks.

## Goals / Non-Goals

**Goals:**
- Support pairs of two different cards without changing the existing decks.
- Alphabet deck fully data-driven (JSON), without new image files.

**Non-Goals:**
- Audio/pronunciation, progress tracking per letter, difficulty levels or reading-method phasing beyond a fixed setting.

## Decisions

**1. Optional `pairs` field on `Deck` next to `cards`.**
`pairs?: { key: string; letter: string; word: string; emoji: string; phase: number; highlight?: string }[]`, `pairsPerGame?: number` and `maxPhase?: number`. If `pairs` exists the board is built from it; otherwise `cards` keeps the old behaviour. Alternative: generalise `cards` to objects for all decks — breaks existing data and tests for no gain.

**2. `BoardCard` gets `pairKey` and `face`.**
`BoardCard = { id, name, coverIndex, pairKey, face: { kind: 'image' } | { kind: 'letter', text } | { kind: 'word', emoji, text } }`. For existing decks `pairKey = name` and `face.kind = 'image'`. `#checkForMatch` compares `pairKey` and requires `first.id !== second.id`. Because the letter and word of one pair share the same `pairKey` and each pair has only one of each, two letter cards or two word cards can never match. Alternative: a separate match function per deck type — more code for the same result.

**3. Emoji as the word picture.**
No need for 30+ new SVGs; `font-size` scales on mobile. Downside: rendering differs per OS. Alternative: add an SVG set (e.g. OpenMoji) — more work, and possible later without a data model change (`emoji` → `image`).

**4. `pairsPerGame` with random selection when building the board.**
Selection happens in the same `linkedSignal` computation as the shuffle, so it stays stable during a running game (existing `started && previous` rule). Default 8 pairs (16 cards) for the alphabet deck. Alternative: several small decks — more navigation, and the child would not pick harder letters themselves.

**5. Rendering in `CardComponent`.**
`@switch` on `card().face.kind`: image (existing), letter (large text, `aria-label` = letter), word (emoji + word). Reuses the `.front-face` styling for the flip. `alt`/aria labels are in Dutch.

**6. Word list (DRAFT, pending the school's method).**
His school uses Veilig leren lezen, but the version (maan, zoem or kim) is unknown. The phasing follows the kim version where it was found; the words are my own proposals, not confirmed key words from the book. Phase 2 (kern 2) is unverified and phase 3 has an unknown order.
- Phase 1 (start + kern 1): i inkt, k kat, m maan, s sok, p pen, aa aap, r raket, e emmer, v vis
- Phase 2 (kern 2 and 3): n neus, t tomaat, b bal, ee eend, oo oor, d deur, oe oester, z zon, ij ijs, h huis
- Phase 3 (rest, order unknown): l lamp, ie vlieg, eu euro, ou goud, uu uur, ui ui, o olifant, u uil, a appel, g geit, j jas, w wolk, f fiets, au auto, ei ei, sch schaap, ng ring, nk bank
Q, x, y and c are left out on purpose: they are rarely taught in first grade. The list is replaced once the right version and key words are known (see Open Questions).

**7. Phases and highlighting the sound.**
Each pair has a `phase`; `maxPhase` on the deck determines up to which phase is played (default: all). When building the board, pairs are first filtered to `maxPhase` and then `pairsPerGame` are picked at random. This lets the parent raise the phase as the son learns new letters, and another method version fits in `data.json` without code changes. For sounds without a good word that starts with them (ie, ou, eu, ng, nk) the sound is inside the word; `highlight` marks those letters on the word card (e.g. vl**ie**g). Alternative: only words that start with the sound — forces hard-to-draw words.

## Risks / Trade-offs

- [Emoji do not exist for every word, or look different] → choose words with unambiguous emoji; the word is always shown below the picture.
- [Words are not the key words from his reading book] → phases and words are data; replace them in `data.json` once the version is known.
- [Setting `maxPhase` needs a way to choose it] → start with a fixed value in `data.json`; a selector in the UI is out of scope.
- [A second card kind raises the risk of regressions in existing decks] → existing `game.service`/`card.component` tests stay unchanged and green as a safety net.
- [16 cards with large letters on small screens] → existing grid with `--card-count`; check visually on mobile.

## Open Questions

- Which version of Veilig leren lezen the school uses, and its matching kernen and key words. Filling them in `data.json` needs no spec or task change.
