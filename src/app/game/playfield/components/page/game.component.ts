import { Component, inject } from "@angular/core";
import { DeckService } from "../../services/deck.service";
import { DeckComponent } from "../deck/deck.component";
import { GameStatusBarComponent } from "../../../game-status-bar/components/game-status-bar/game-status-bar.component";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
  imports: [DeckComponent, GameStatusBarComponent],
})
export class GameComponent {
  #deckService = inject(DeckService);
  deck = this.#deckService.selectedDeck;
}
