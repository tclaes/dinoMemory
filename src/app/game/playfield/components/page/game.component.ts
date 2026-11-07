import { Component, effect, inject, input, untracked } from "@angular/core";
import { Router } from "@angular/router";
import { DEFAULT_DECK, DeckService } from "../../services/deck.service";
import { DeckComponent } from "../deck/deck.component";
import { GameService } from "../../services/game.service";
import { GlobalService } from "../../../global/services/global.service";
import { ScoreboardComponent } from "../../../scoreboard/scoreboard.component";
import { GameStatusBarComponent } from "../../../game-status-bar/components/game-status-bar/game-status-bar.component";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
  imports: [DeckComponent, GameStatusBarComponent, ScoreboardComponent],
})
export class GameComponent {
  #deckService = inject(DeckService);
  #globalService = inject(GlobalService);
  #router = inject(Router);
  gameService = inject(GameService);
  /** Deck name from the `game/:deck` route; empty on `/`. */
  deck = input<string>();
  selectedDeck = this.#deckService.selectedDeck;

  constructor() {
    // Opening a deck, by link or by address, starts a new game with that deck.
    effect(() => {
      const name = this.deck() ?? DEFAULT_DECK;
      untracked(() => {
        this.#globalService.stopGame();
        this.#deckService.selectDeck(name);
      });
    });

    // Send unknown deck names to `/`, but only once the decks have loaded.
    effect(() => {
      const name = this.deck();
      const decks = this.#deckService.availableDecks();
      if (name && decks && !decks.some((deck) => deck.name === name)) {
        untracked(() => this.#router.navigate(["/"], { replaceUrl: true }));
      }
    });
  }
}
