# Design

## Context

Zie proposal.md voor motivatie. Huidige situatie:

- `Deck` (`model/deck.ts`) heeft `cards: string[]`; `GameService.board` maakt per naam twee `BoardCard`s (`{id, name, coverIndex}`) en `#checkForMatch` vergelijkt `first.name === second.name`.
- `CardComponent` toont altijd `assets/img/{imgURL}/{name}.svg` als voorkant.
- Decks komen uit `src/assets/data.json` via `DeckService`; de navigatie toont alle decks.

## Goals / Non-Goals

**Goals:**
- Paren van twee verschillende kaarten ondersteunen zonder de bestaande decks te wijzigen.
- Alfabet-deck volledig data-gedreven (JSON), zonder nieuwe afbeeldingsbestanden.

**Non-Goals:**
- Audio/uitspraak, voortgangsregistratie per letter, moeilijkheidsgraden of leesmethode-fasering.

## Decisions

**1. Optioneel `pairs`-veld op `Deck` naast `cards`.**
`pairs?: { key: string; letter: string; word: string; emoji: string; phase: number; highlight?: string }[]`, `pairsPerGame?: number` en `maxPhase?: number`. Als `pairs` bestaat, bouwt het bord daaruit; anders blijft `cards` het oude gedrag. Alternatief: `cards` veralgemenen naar objecten voor alle decks — breekt bestaande data en tests zonder meerwaarde.

**2. `BoardCard` krijgt `pairKey` en `face`.**
`BoardCard = { id, name, coverIndex, pairKey, face: { kind: 'image' } | { kind: 'letter', text } | { kind: 'word', emoji, text } }`. Voor bestaande decks is `pairKey = name` en `face.kind = 'image'`. `#checkForMatch` vergelijkt `pairKey` en eist `first.id !== second.id`. Omdat letter en woord van één paar dezelfde `pairKey` delen en elk paar maar één van elk heeft, kunnen twee letterkaarten of twee woordkaarten nooit matchen. Alternatief: aparte matchfunctie per deck-type — meer code voor hetzelfde resultaat.

**3. Emoji als woordafbeelding.**
Geen 30+ nieuwe SVG's nodig; `font-size` schaalt mee op mobiel. Nadeel: weergave verschilt per OS. Alternatief: SVG-set (bv. OpenMoji) toevoegen — meer werk, later mogelijk zonder datamodelwijziging (`emoji` → `image`).

**4. `pairsPerGame` met willekeurige selectie bij bordopbouw.**
Selectie gebeurt in dezelfde `linkedSignal`-berekening als de shuffle, dus blijft stabiel tijdens een lopend spel (bestaande `started && previous`-regel). Standaard 8 paren (16 kaarten) voor het alfabet-deck. Alternatief: meerdere kleine decks — meer navigatie, kind kiest dan zelf moeilijkere letters niet.

**5. Weergave in `CardComponent`.**
`@switch` op `card().face.kind`: afbeelding (bestaand), letter (grote tekst, `aria-label` = letter), woord (emoji + woord). Hergebruikt `.front-face`-styling voor de flip. `alt`/aria-labels in het Nederlands.

**6. Woordenlijst (DRAFT, in afwachting van de schoolmethode).**
Zijn school gebruikt Veilig leren lezen, maar de versie (maan, zoem of kim) is onbekend. De fasering volgt de kim-versie waar die gevonden werd; de woorden zijn eigen voorstellen, geen bevestigde kernwoorden uit het boek. Fase 2 (kern 2) is niet geverifieerd en fase 3 heeft een onbekende volgorde.
- Fase 1 (start + kern 1): i inkt, k kat, m maan, s sok, p pen, aa aap, r raket, e emmer, v vis
- Fase 2 (kern 2 en 3): n neus, t tomaat, b bal, ee eend, oo oor, d deur, oe oester, z zon, ij ijs, h huis
- Fase 3 (rest, volgorde onbekend): l lamp, ie vlieg, eu euro, ou goud, uu uur, ui ui, o olifant, u uil, a appel, g geit, j jas, w wolk, f fiets, au auto, ei ei, sch schaap, ng ring, nk bank
Q, x, y en c ontbreken bewust: ze komen in het 1ste leerjaar zelden aan bod. De lijst wordt vervangen zodra de juiste versie en kernwoorden bekend zijn (zie Open Questions).

**7. Fases en markering van de klank.**
Elk paar heeft een `phase`; `maxPhase` op het deck bepaalt tot welke fase er gespeeld wordt (standaard alle). Bij het bouwen van het bord worden eerst de paren tot `maxPhase` gefilterd en daarna `pairsPerGame` willekeurig gekozen. Zo kan de ouder de fase verhogen naarmate de zoon nieuwe letters leert, en past een andere methode-versie in `data.json` zonder codewijziging. Voor klanken zonder goed woord dat ermee begint (ie, ou, eu, ng, nk) staat de klank in het woord; `highlight` markeert die letters op de woordkaart (bv. vl**ie**g). Alternatief: enkel woorden die met de klank beginnen — dwingt tot slecht tekenbare woorden.

## Risks / Trade-offs

- [Emoji bestaan niet voor elk woord, of zien er anders uit] → woorden kiezen met eenduidige emoji; woord staat altijd onder de afbeelding.
- [Woorden zijn niet de kernwoorden uit zijn leesboek] → fases en woorden zijn data; vervangen in `data.json` zodra de versie bekend is.
- [Fase-instelling vraagt een manier om `maxPhase` te kiezen] → eerst vaste waarde in `data.json`; een keuzeknop in de UI valt buiten scope.
- [Tweede kaartsoort verhoogt kans op regressie in bestaande decks] → bestaande `game.service`/`card.component`-tests blijven ongewijzigd groen als vangnet.
- [16 kaarten met grote letters op kleine schermen] → bestaande grid met `--card-count`; visueel controleren op mobiel.

## Open Questions

- Welke versie van Veilig leren lezen de school gebruikt, en de bijhorende kernen en kernwoorden. Invullen in `data.json` kan zonder spec- of taakwijziging.
