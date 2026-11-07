# Design

## Context

- `app.routes.ts` already declares `game/:deck` under the authenticated `LayoutComponent`, next to `""` (game) and `user` (profile), but nothing reads the `:deck` parameter.
- The selected deck lives in `DeckService.#selected` (a signal, default `'dinos'`); `GameService.board` and `GameComponent.deck` derive from `DeckService.selectedDeck`.
- `NavigationComponent.selectDeck(name)` calls `GlobalService.stopGame()` and `DeckService.selectDeck(name)`. Stopping the game resets flipped/matched cards, the score-saved flag, the clicks counter and the timer, because they are `linkedSignal`s on `gameStarted$`.
- `.deck-pill` already has an `[aria-pressed="true"]` active style, but nothing sets `aria-pressed`.
- `DeckService` loads decks over HTTP, so `availableDecks()` is `undefined` until the request completes.

## Goals / Non-Goals

**Goals:**
- The URL is the source of truth for which deck the game page shows.
- Deck items are real links, with the current one exposed through `aria-current`.

**Non-Goals:**
- Preserving a running game when the player leaves the game page and comes back: returning starts a new game.
- Changing the profile link, the logo link or the logout button.
- Restyling the header beyond moving the existing active style to the new attribute.

## Decisions

1. **Bind the route parameter with `withComponentInputBinding()`.** Add it to `provideRouter(routes, …)` and give `GameComponent` an optional `deck = input<string>()`. Alternative: inject `ActivatedRoute` and read `paramMap`. Input binding is the idiomatic signal-based approach in current Angular, needs no subscription and makes the component trivially testable (set the input). The existing `deck` field on `GameComponent` (the selected `Deck` object) is renamed to `selectedDeck` to free the name.

2. **`GameComponent` drives the selection in an `effect`.** On every change of the `deck` input (`undefined` on `/` → `'dinos'`): call `GlobalService.stopGame()` and `DeckService.selectDeck(name)`. Because the component is created anew when coming back from `/user`, and the input changes when switching decks, both cases start a new game, matching the spec. `stopGame()`/`selectDeck()` must run `untracked` so the effect only depends on the input. Alternative: a route resolver or guard that calls the service — more indirection for the same result.

3. **Default deck lives in one place.** `DeckService` exposes the default name (`DEFAULT_DECK = 'dinos'`) and `GameComponent` uses it when the input is empty. `/` stays a separate route so it renders the default deck without a redirect.

4. **Unknown deck → `/` once decks are loaded.** A second check in the effect: when `availableDecks()` is defined and contains no deck with the requested name, `router.navigate(['/'], { replaceUrl: true })`. Waiting for the decks avoids redirecting valid names during the HTTP load. `replaceUrl` keeps the bad address out of history. Alternative: a `CanMatch` guard — it would need to await the HTTP load and duplicates the data access.

5. **Navigation uses `routerLink`, current deck from state.** Each item is `<a [routerLink]="['/game', deck.name]" [attr.aria-current]="currentDeck() === deck.name ? 'page' : null">`. `currentDeck` is a `computed`: the selected deck's name while the router URL is `/` or `/game/…`, otherwise `null`; the URL comes from a `toSignal` of `NavigationEnd` events. Alternative: `routerLinkActive` with `ariaCurrentWhenActive="page"` — rejected because it only matches `/game/<name>`, so on `/` the shown "dinos" deck would not be marked. The CSS selector moves from `[aria-pressed="true"]` to `[aria-current="page"]`. `selectDeck()` and the `GlobalService` injection are removed from `NavigationComponent`.

## Risks / Trade-offs

- [`withComponentInputBinding()` binds route params, query params and data to inputs of every routed component] → Checked: none of the other routed components (`LayoutComponent`, `UserprofileComponent`, `LoginComponent`, `RegisterComponent`) declares an input today.
- [Leaving the game page and returning now always resets the game, while previously a game could survive a trip to `/user`] → Accepted and specified; a running timer on a hidden page was not meaningful anyway.
- [Anchors styled as pills lose button defaults (`cursor`, no underline, inline display)] → Add `text-decoration: none` and `display: inline-flex` to `.deck-pill`; keep `.focusable` for the focus ring.
- [e2e `alfabet.spec.ts` uses `getByRole('button', { name: 'alfabet' })`] → Update to `link`; it would fail otherwise.
