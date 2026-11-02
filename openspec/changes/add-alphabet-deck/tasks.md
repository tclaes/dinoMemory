# Tasks

## 1. Datamodel en gamelogica

- [x] 1.1 Breid `Deck` uit met optionele `pairs` (incl. `phase`, `highlight`), `pairsPerGame` en `maxPhase`, en `BoardCard` met `pairKey` en `face`. Verifieer: `npx tsc --noEmit` slaagt.
- [x] 1.2 Pas bordopbouw in `GameService.board` aan: bouw uit `pairs` (één letter- en één woordkaart per paar, eerst gefilterd op `maxPhase`, dan beperkt tot `pairsPerGame`, willekeurig en zonder dubbels), anders uit `cards` zoals voorheen. Verifieer: nieuwe tests in `game.service.spec.ts` voor 16 kaarten uit >8 paren, geen dubbels, stabiel bord tijdens spel, enkel paren tot `maxPhase`.
- [x] 1.3 Pas `#checkForMatch` aan om `pairKey` te vergelijken. Verifieer: tests voor letter+juist woord (match), letter+fout woord (geen match), twee identieke dino-kaarten (match); bestaande game.service-tests blijven groen.

## 2. Kaartweergave

- [x] 2.1 Laat `CardComponent` per `face.kind` renderen: afbeelding (bestaand), letter (grote tekst, aria-label met de letter) en woord (emoji + woord, met `highlight` gemarkeerd). Verifieer: tests in `card.component.spec.ts` voor elke soort; bestaande tests blijven groen.
- [x] 2.2 Style letter- en woordkaart in `card.component.scss` (lettergrootte, contrast, mobiel). Verifieer: visuele controle van het bord op desktop en mobiele breedte (<800px) via `npm start`.

## 3. Alfabet-deck

- [x] 3.1 Voeg het deck "alfabet" toe aan `src/assets/data.json` met de draft-woordenlijst uit design.md (fases 1–3, `pairsPerGame: 8`, `maxPhase: 1`). Verifieer: datatest dat elke letter/klank hoogstens één keer voorkomt, elk woord de klank bevat en `highlight` (indien aanwezig) in het woord voorkomt.
- [x] 3.2 Controleer dat het deck in de navigatie verschijnt en selecteerbaar is. Verifieer: aangepaste `deck.service.spec.ts`/`navigation.component.spec.ts`.

## 4. Afronding

- [x] 4.1 Laat de volledige testsuite en lint draaien. Verifieer: `npm test`, `npm run lint` slagen.
- [x] 4.2 Speel het alfabet-deck handmatig in de browser: letter+woord matcht, twee letters niet, nieuw spel geeft andere paren, dinos-deck werkt nog. Verifieer: visuele controle.
