import {Component, inject} from '@angular/core';
import {DeckService} from '../../shared/deck.service';
import {GameService} from '../game.service';
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
  #deckService = inject(DeckService)
  protected _gameService = inject(GameService)

  decks$ = this.#deckService.availableDecks
}
