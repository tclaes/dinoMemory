import {Component, inject} from '@angular/core';
import {DeckService} from '../../services/deck.service';
import {DeckComponent} from '../deck/deck.component';
import {ScoreComponent} from '../../../score/score.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [
    DeckComponent,
    ScoreComponent
  ]
})

export class GameComponent {
  #deckService = inject(DeckService);
  deck = this.#deckService.selectedDeck;
}
