## ADDED Requirements

### Requirement: Alfabet-deck beschikbaar
Het systeem SHALL een deck "alfabet" aanbieden naast de bestaande decks, selecteerbaar via dezelfde navigatie.

#### Scenario: Deck zichtbaar in navigatie
- **WHEN** de decks geladen zijn
- **THEN** staat "alfabet" in de lijst van beschikbare decks

#### Scenario: Deck selecteren
- **WHEN** de gebruiker "alfabet" kiest
- **THEN** toont het bord de kaarten van het alfabet-deck

### Requirement: Inhoud volgens leerstof 1ste leerjaar
Het alfabet-deck SHALL paren bevatten voor de letters en klanken uit het 1ste leerjaar, waaronder de tweetekenklanken aa, ee, oo, uu, ie, oe, eu, ui, ou, au, ei, ij, sch, ng en nk. Elk paar SHALL een eigen woord hebben dat de letter of klank bevat.

#### Scenario: Geen dubbele letters
- **WHEN** het deck wordt geladen
- **THEN** komt elke letter of klank hoogstens één keer voor als paar

#### Scenario: Woord bevat de klank
- **WHEN** een paar wordt bekeken
- **THEN** bevat het woord van de woordkaart de letter of klank van de letterkaart

### Requirement: Markering van de klank in het woord
Als de klank niet aan het begin van het woord staat, SHALL het paar aangeven welke letters in het woord bij de klank horen, en SHALL de woordkaart die letters zichtbaar markeren.

#### Scenario: Klank midden in het woord
- **WHEN** het paar "ie" met het woord "vlieg" een woordkaart toont
- **THEN** zijn de letters "ie" in "vlieg" zichtbaar gemarkeerd

### Requirement: Fases
Elk paar SHALL tot een fase behoren, en het deck MAY een hoogste fase opgeven. Het systeem SHALL enkel paren uit fases tot en met die hoogste fase gebruiken. Zonder opgegeven fase worden alle paren gebruikt.

#### Scenario: Beperkt tot een fase
- **WHEN** de hoogste fase 1 is en een nieuw spel start
- **THEN** komen enkel paren uit fase 1 op het bord

#### Scenario: Geen hoogste fase
- **WHEN** het deck geen hoogste fase opgeeft
- **THEN** komen alle paren in aanmerking

### Requirement: Letterkaart
De letterkaart SHALL de letter of klank in kleine letters tonen in groot, goed leesbaar lettertype.

#### Scenario: Letter getoond
- **WHEN** een letterkaart omgedraaid is
- **THEN** is de letter of klank zichtbaar als tekst en heeft de kaart een toegankelijke naam met die letter

### Requirement: Woordkaart
De woordkaart SHALL een afbeelding van het woord tonen met het woord eronder geschreven.

#### Scenario: Woord getoond
- **WHEN** een woordkaart omgedraaid is
- **THEN** zijn de afbeelding en het woord zichtbaar
