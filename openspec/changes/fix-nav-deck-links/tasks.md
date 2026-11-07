# Tasks

## 1. Deck selection follows the URL

- [x] 1.1 Add `withComponentInputBinding()` to `provideRouter` in `src/app/app.config.ts`; verify `npm run build` succeeds
- [x] 1.2 Expose the default deck name (`'dinos'`) from `DeckService` and use it as the initial `#selected` value; verify `deck.service.spec.ts` still passes
- [x] 1.3 In `GameComponent`, add `deck = input<string>()`, rename the existing `deck` field to `selectedDeck`, and add an `effect` that (untracked) calls `GlobalService.stopGame()` and `DeckService.selectDeck(deck ?? default)` whenever the input changes; verify with new specs in `game.component.spec.ts`: no input selects "dinos", input "alfabet" selects "alfabet", changing the input stops the game
- [x] 1.4 In the same effect, once `availableDecks()` is loaded and has no deck with the requested name, navigate to `/` with `replaceUrl: true`; verify with a spec that an unknown name navigates to `/` and that nothing navigates while decks are still `undefined`

## 2. Navigation items become links

- [x] 2.1 Replace the deck `<button>`s in `navigation.component.html` with `<a [routerLink]="['/game', deck.name]">` anchors and remove `selectDeck()` from `NavigationComponent`; verify the nav spec asserts a link per deck with `href="/game/dinos"` and no deck buttons
- [x] 2.2 Add a `currentDeck` computed (selected deck name while the URL is `/` or `/game/…`, else `null`) and bind `[attr.aria-current]="currentDeck() === deck.name ? 'page' : null"`; verify with specs that on `/game/alfabet` only "alfabet" has `aria-current="page"` and on `/user` none has
- [x] 2.3 Update `.deck-pill` in `navigation.component.scss`: active selector `[aria-current="page"]`, plus `text-decoration: none` and `display: inline-flex` for anchors; verify `npm run lint:styles` passes and the pills look unchanged in `npm start`
- [x] 2.4 Keep the "Bye!" control a `<button>`; verify the existing logout spec still passes
- [x] 2.5 Restart the game when the link of the shown deck is clicked (`restartIfCurrent()` calls `GlobalService.stopGame()`), since the router ignores same-URL navigation; verify with nav specs (current deck → `stopGame`, other deck → not) and an e2e test in `alfabet.spec.ts`

## 3. End-to-end coverage

- [x] 3.1 Update `e2e/alfabet.spec.ts` to choose the deck with `getByRole('link', { name: 'alfabet' })` and assert the URL `/game/alfabet`; verify `npm run e2e -- alfabet` passes
- [x] 3.2 Add an e2e test in `e2e/profile.spec.ts`: from the profile page choose "alfabet" in the navigation, expect URL `/game/alfabet` and eight letter cards; verify `npm run e2e -- profile` passes
- [x] 3.3 Add an e2e test that opening `/game/unknown` lands on `/` with the dinos board; verify it passes

## 4. Integration check

- [x] 4.1 Run `npm run lint`, `npm run test:ci` and `npm run e2e`; verify all pass
- [x] 4.2 Run `openspec validate fix-nav-deck-links --strict`; verify it reports the change as valid

## Workflow follow-up

- Archive the change with `/opsx:archive` after the PR is reviewed and merged.
