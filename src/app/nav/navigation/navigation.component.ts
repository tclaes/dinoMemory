import { Component, inject } from "@angular/core";
import { DeckService } from "../../game/playfield/services/deck.service";
import { AuthService } from "../../core/auth/services/auth.service";
import { RouterLink } from "@angular/router";

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

  selectDeck(e) {
    this.deckService.selectDeck(e);
  }

  async logOut() {
    await this.#authService.logOut();
  }
}
