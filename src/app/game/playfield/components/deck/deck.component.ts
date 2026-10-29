import {Component, inject} from '@angular/core';
import {GameService} from '../../services/game.service';
import {CardComponent} from '../cards/card.component';
import {ScoreboardComponent} from '../../../scoreboard/scoreboard.component';
import {GameWonDirective} from '../../../../shared/game-won.directive';

@Component({
  selector: 'app-deck',
  imports: [
    CardComponent,
    ScoreboardComponent,
    GameWonDirective
  ],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.css',
  host: {
    '[style.--card-count]': 'board().length',
  },
})
export class DeckComponent {
  gameService = inject(GameService);
  board = this.gameService.board;
  deck = this.gameService.deck;

  flipCard(id: string) {
    this.gameService.flipCard(id);
  }
}
