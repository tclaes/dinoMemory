import { Component, OnInit, Renderer, ViewChildren, AfterViewInit, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { GameService } from './game.service';
import { CardsComponent } from './cards/cards.component';
import { SharedService } from '../shared/shared.service';
import { Deck, DeckService } from '../shared/deck.service';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements AfterViewInit {

  clicked;
  deck: Deck;
  timer;

  @ViewChildren(CardsComponent, {read: ElementRef}) cards: QueryList<CardsComponent>;

  constructor(public gameSrv: GameService, public renderer: Renderer,
    public renderer2: Renderer2,
    private sharedSrv: SharedService,
    private deckSrv: DeckService) {
    gameSrv.renderer = renderer;
    gameSrv.renderer2 = renderer2;
    sharedSrv.standardDeck.subscribe(deck => this.deck = deck);
  }

  newGame() {
    this.gameSrv.newGame();
    this.cards.changes.subscribe(c => {
      c.toArray().forEach(item => this.gameSrv.shuffle(item));
    });
  }

  flipCard(e) {
    this.sharedSrv.cardClicked(++this.clicked);
    this.gameSrv.flipCard(e);
  }

  ngAfterViewInit(): void {
    this.newGame();
    this.sharedSrv.currentTimesClicked.subscribe(timesClicked => this.clicked = timesClicked);
  }
}
