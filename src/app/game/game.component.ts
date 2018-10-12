import { Component, OnInit, Renderer, ViewChildren, AfterViewInit, QueryList, ElementRef, ViewChild } from '@angular/core';
import { GameService } from './game.service';
import { CardsComponent } from './cards/cards.component';
import { SharedService } from '../shared/shared.service';
import { Deck, DeckService } from '../shared/deck.service';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit, AfterViewInit {

  clicked;
  standardDeck: Deck = {
    name: 'dinos'
  };

  @ViewChildren(CardsComponent, {read: ElementRef}) cards: QueryList<CardsComponent>;

  constructor(public gameSrv: GameService, public renderer: Renderer,
    private sharedSrv: SharedService,
    private deckSrv: DeckService) {
    gameSrv.renderer = renderer;
    sharedSrv.standardDeck.subscribe(deck => this.standardDeck = deck);
    deckSrv.setDeckObservable(this.standardDeck.name)
    .subscribe(card => {
      this.standardDeck.cards = card['cards'];
      this.standardDeck.imgUrl = card['imgURL'];
      this.standardDeck.frontFace = card['frontFace'];
      sharedSrv.setDeck(this.standardDeck);
    });
  }

  newGame(e) {
    this.gameSrv.newGame(e);
    this.cards.changes.subscribe(c => {
      c.toArray().forEach(item => this.gameSrv.shuffle(item));
    });
  }

  flipCard(e) {
    this.gameSrv.flipCard(e);
    this.sharedSrv.cardClicked(++this.clicked);
  }

  ngOnInit() {
    this.gameSrv.standardDeck = this.standardDeck;
  }

  ngAfterViewInit(): void {
    this.newGame(this.standardDeck.name);
    this.sharedSrv.currentTimesClicked.subscribe(timesClicked => this.clicked = timesClicked);
  }
}
