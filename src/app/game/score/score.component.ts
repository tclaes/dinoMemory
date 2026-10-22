import {Component, inject} from '@angular/core';
import {DeckService} from '../playfield/services/deck.service';
import {GameService} from '../playfield/services/game.service';
import {ClicksComponent} from '../clicks/clicks.component';
import {TimerComponent} from '../timer/timer.component';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
  imports: [
    ClicksComponent,
    TimerComponent
  ]
})
export class ScoreComponent {
  protected _gameService = inject(GameService);
  #deckService = inject(DeckService);
  decks$ = this.#deckService.availableDecks;
}
