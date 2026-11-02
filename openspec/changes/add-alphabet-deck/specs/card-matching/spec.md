## ADDED Requirements

### Requirement: Paren van verschillende kaarten
Het systeem SHALL twee omgedraaide kaarten als paar beschouwen wanneer ze dezelfde paarsleutel hebben en verschillende kaartkanten (zijden) van het paar zijn. Voor decks zonder gedefinieerde paren SHALL het paar bestaan uit twee identieke kaarten, zoals voorheen.

#### Scenario: Letter en bijhorend woord
- **WHEN** de letterkaart "b" en de woordkaart "bal" omgedraaid zijn
- **THEN** blijven beide kaarten omgedraaid en tellen ze als gevonden paar

#### Scenario: Letter en verkeerd woord
- **WHEN** de letterkaart "b" en de woordkaart "kat" omgedraaid zijn
- **THEN** worden beide kaarten na korte tijd teruggedraaid

#### Scenario: Bestaand deck ongewijzigd
- **WHEN** in het dinos-deck twee kaarten met dezelfde dino omgedraaid zijn
- **THEN** vormen ze een paar

### Requirement: Eén kaart per kant
Voor decks met gedefinieerde paren SHALL het bord per paar precies één letterkaart en één woordkaart bevatten.

#### Scenario: Bord opgebouwd
- **WHEN** een spel start met het alfabet-deck en 8 paren
- **THEN** bevat het bord 16 kaarten: 8 letterkaarten en 8 woordkaarten, in willekeurige volgorde

### Requirement: Maximum aantal paren per spel
Een deck MAY een maximum aantal paren per spel opgeven. Het systeem SHALL dan bij elk nieuw spel dat aantal paren willekeurig uit het deck kiezen. Zonder maximum worden alle paren gebruikt.

#### Scenario: Subset gekozen
- **WHEN** het alfabet-deck meer paren heeft dan het maximum en een nieuw spel start
- **THEN** bevat het bord enkel het maximum aantal paren, zonder dubbels

#### Scenario: Bord blijft stabiel tijdens spel
- **WHEN** een spel bezig is
- **THEN** verandert de samenstelling van het bord niet
