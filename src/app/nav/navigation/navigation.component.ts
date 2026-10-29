import { Component, inject } from "@angular/core";
import { DeckService } from "../../game/playfield/services/deck.service";
import { AuthService } from "../../core/auth/services/auth.service";
import { RouterLink } from "@angular/router";
import { GlobalService } from "../../game/global/services/global.service";

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
  #globalService = inject(GlobalService);

  selectDeck(name: string) {
    this.#globalService.stopGame();
    this.deckService.selectDeck(name);
  }

  async logOut() {
    await this.#authService.logOut();
  }
}
