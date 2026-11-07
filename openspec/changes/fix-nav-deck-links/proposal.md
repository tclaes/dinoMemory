# Proposal

## Why

On the profile page (`/user`) the deck items in the header navigation do nothing visible: they only change the selected deck in memory and never navigate, so the player cannot get back to the game through the deck navigation. The deck items are also `<button>` elements, while they semantically lead the player to another view and should be links (`<a href>`), which gives correct screen-reader semantics, keyboard behaviour, middle-click/open-in-new-tab and a shareable URL per deck.

## What Changes

- Each deck in the header navigation becomes a link to `/game/<deck name>` instead of a button that calls `selectDeck()`.
- The game page reads the deck from the existing (currently unused) `game/:deck` route parameter and selects that deck; the selected deck therefore follows the URL.
- Choosing a deck from any page, including the profile page, opens the game with that deck.
- Opening a deck (switching deck or coming back from another page) starts a fresh game, like selecting a deck does today.
- The link of the deck that is currently shown is marked as the current page (`aria-current="page"`) and styled as active.
- `/` keeps showing the default deck "dinos".
- An address with an unknown deck name (e.g. `/game/unknown`) sends the player to `/`.
- The "Bye!" logout action stays a `<button>`: it performs an action, it does not navigate to a view.

## Capabilities

### New Capabilities
- `deck-navigation`: the header navigation that lists the available decks, how choosing a deck opens the game with that deck from any page, the deck address, the current-deck marking, and the link semantics of the navigation items.

### Modified Capabilities
- `alphabet-deck`: the "Selecting the deck" scenario now opens the deck through its link and address (`/game/alfabet`) instead of an in-memory selection.

## Impact

- `src/app/nav/navigation/` (template, component, styles, unit spec): buttons → `routerLink` anchors with `routerLinkActive`; `selectDeck()` removed from the component.
- `src/app/game/playfield/components/page/game.component.ts` (+ spec): reads the `deck` route parameter, stops the running game and selects the deck; redirects unknown deck names to `/`.
- `src/app/app.config.ts`: enable `withComponentInputBinding()` on `provideRouter` so the route parameter binds to a component input.
- `e2e/alfabet.spec.ts`: selects the deck via `getByRole('link', { name: 'alfabet' })`; new e2e coverage for returning from the profile page to the game.
- No API, data or dependency changes.
