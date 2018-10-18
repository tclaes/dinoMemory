import { Component, OnInit, Renderer, ViewChildren, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { GameService } from './game.service';
import { CardsComponent } from './cards/cards.component';
import { SharedService } from '../shared/shared.service';
import { Deck, DeckService } from '../shared/deck.service';
import { Player } from './../userprofile/player/player.component';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit, AfterViewInit {

  clicked;
  deck: Deck;
  player: Player;
  timer;

  @ViewChildren(CardsComponent, {read: ElementRef}) cards: QueryList<CardsComponent>;

  constructor(public gameSrv: GameService, public renderer: Renderer,
    private sharedSrv: SharedService,
    private deckSrv: DeckService) {
    gameSrv.renderer = renderer;
    sharedSrv.standardDeck.subscribe(deck => this.deck = deck);
    deckSrv.setDeckObservable(this.deck.name)
    .subscribe(card => {
      this.deck.cards = card['cards'];
      this.deck.imgUrl = card['imgURL'];
      this.deck.frontFace = card['frontFace'];
      sharedSrv.setDeck(this.deck);
    });
    sharedSrv.currentPlayer.subscribe(player => this.player = player);
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

  ngOnInit() {
    this.gameSrv.deck = this.deck;
  }

  ngAfterViewInit(): void {
    this.newGame();
    this.sharedSrv.currentTimesClicked.subscribe(timesClicked => this.clicked = timesClicked);
  }
}
