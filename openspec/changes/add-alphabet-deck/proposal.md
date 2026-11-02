# Proposal

## Why

De zoon van de eigenaar leert het alfabet in het 1ste leerjaar (Vlaanderen). Het memory-spel is een leuke manier om letters en klanken te oefenen, maar de bestaande decks (dinos, frameworks) bestaan enkel uit identieke kaartparen. Om letters aan klanken te koppelen is een paar nodig dat uit twee verschillende kaarten bestaat: de letter en een woord dat die klank bevat.

## What Changes

- Nieuw deck **alfabet** met letters en klanken uit het 1ste leerjaar: klinkers, medeklinkers en tweetekenklanken (aa, ee, oo, uu, ie, oe, eu, ui, ou, au, ei, ij, sch, ng, nk).
- Elk paar bestaat uit een **letterkaart** (de letter of klank in grote, duidelijke tekst) en een **woordkaart** (afbeelding van een woord dat de klank bevat, met het woord eronder; staat de klank niet vooraan, dan worden die letters gemarkeerd).
- Het spel kan nu paren van **verschillende** kaarten matchen; twee letterkaarten of twee woordkaarten vormen nooit een paar.
- Paren zijn ingedeeld in **fases** (volgens de leesmethode Veilig leren lezen); een deck kan het spel beperken tot een hoogste fase, zodat enkel letters voorkomen die het kind al kent. De draft volgt de kim-versie; de definitieve versie van de school is nog onbekend.
- Een deck kan het aantal paren per spel beperken, zodat het bord speelbaar blijft voor een kind (bv. 8 willekeurige paren uit het volledige alfabet).
- Bestaande decks (dinos, frameworks) blijven ongewijzigd werken.

## Capabilities

### New Capabilities
- `alphabet-deck`: Inhoud en weergave van het alfabet-deck: welke letters/klanken, welke woorden, en hoe letter- en woordkaarten eruitzien.
- `card-matching`: Regels waarmee twee omgedraaide kaarten een paar vormen, inclusief paren van verschillende kaarten en een maximum aantal paren per spel.

### Modified Capabilities
<!-- Geen: er bestaan nog geen specs in openspec/specs/. -->

## Impact

- `src/assets/data.json`: nieuw deck, nieuw (optioneel) veld voor paren en `pairsPerGame`.
- `src/app/game/playfield/model/deck.ts` en `model/board.ts`: uitgebreid met paardefinitie, paarsleutel en kaartweergave.
- `src/app/game/playfield/services/game.service.ts`: bordopbouw en matchcontrole.
- `src/app/game/playfield/components/cards/card.component.*`: tekst- en woordkaart naast de bestaande afbeeldingskaart.
- Unit tests voor `game.service`, `card.component`, `deck.service`; mogelijk een e2e-test.
- Geen nieuwe dependencies. Geen backend- of Firestore-wijzigingen.

## Aannames

- Woordafbeeldingen zijn emoji (geen nieuwe SVG-assets nodig); het woord staat eronder zodat het kind ook leest.
- De woordenlijst is een draft: de versie van Veilig leren lezen en de kernwoorden zijn onbekend. De ouder levert die later aan; vervangen kan in `data.json` zonder codewijziging.
- Uitspraak/audio valt buiten scope.
