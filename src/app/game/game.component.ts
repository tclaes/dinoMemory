import {AfterViewInit, Component, computed, ElementRef, inject, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {GameService} from './game.service';
import {CardComponent} from './components/cards/card.component';
import {SharedService} from '../shared/shared.service';
import {GameModule} from './game.module';
import {ScoreComponent} from './score/score.component';
import {ScoreboardComponent} from './scoreboard/scoreboard.component';
import {GameWonDirective} from '../shared/game-won.directive';
import {toSignal} from '@angular/core/rxjs-interop';
import {DeckService} from '../shared/deck.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [
    GameModule,
    CardComponent,
    ScoreComponent,
    ScoreboardComponent,
    GameWonDirective
  ]
})

export class GameComponent implements AfterViewInit {
  @ViewChildren(CardComponent, {read: ElementRef}) cards: QueryList<CardComponent>;

  gameSrv = inject(GameService)
  renderer2 = inject(Renderer2)
  #deckService = inject(DeckService)
  #sharedService = inject(SharedService)

  clicked = toSignal(this.#sharedService.currentTimesClicked)
  timesClicked = computed(() => this.clicked() + 1)
  deck = this.#deckService.selectedDeck

  constructor() {
    this.gameSrv.renderer2 = this.renderer2;
  }

  newGame() {
    this.gameSrv.newGame();
    this.cards.changes.subscribe(c => {
      c.forEach(item => this.gameSrv.shuffle(item));
    });
  }

  flipCard(e) {
    this.#sharedService.cardClicked(this.timesClicked());
    this.gameSrv.flipCard(e);
  }

  ngAfterViewInit(): void {
    this.newGame();
  }
}
