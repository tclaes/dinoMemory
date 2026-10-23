import {Component, inject} from '@angular/core';
import {GameService} from '../../services/game.service';
import {CardComponent} from '../cards/card.component';

@Component({
  selector: 'app-deck',
  imports: [
    CardComponent
  ],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.css',
})
export class DeckComponent {
  gameService = inject(GameService);
  board = this.gameService.board;
  deck = this.gameService.deck;

  flipCard(id: string) {
    this.gameService.flipCard(id);
  }
}
