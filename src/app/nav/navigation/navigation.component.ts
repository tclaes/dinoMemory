import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter, map } from "rxjs";
import { DeckService } from "../../game/playfield/services/deck.service";
import { AuthService } from "../../core/auth/services/auth.service";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
  imports: [RouterLink],
})
export class NavigationComponent {
  deckService = inject(DeckService);
  decks$ = this.deckService.availableDecks;
  deck = this.deckService.selectedDeck;
  #authService = inject(AuthService);
  #router = inject(Router);

  #url = toSignal(
    this.#router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.#router.url },
  );

  /** Name of the deck shown on the game page, or null on any other page. */
  currentDeck = computed(() => {
    const path = this.#url().split(/[?#]/)[0];
    const onGamePage = path === "/" || path.startsWith("/game/");
    return onGamePage ? (this.deck()?.name ?? null) : null;
  });

  async logOut() {
    await this.#authService.logOut();
  }
}
