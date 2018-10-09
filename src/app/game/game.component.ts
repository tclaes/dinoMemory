import { Component, OnInit, Renderer, ViewChildren, Input, AfterViewInit, QueryList, ElementRef, ViewChild } from '@angular/core';
import { GameService } from './game.service';
import { CardsComponent } from './cards/cards.component';
import { Deck } from '../shared/standard-deck.directive';
import { SharedService } from '../shared/shared.service';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit, AfterViewInit {

  @Input() nrOfClicks;
  private clicked;

  constructor(public gameSrv: GameService, public renderer: Renderer, private sharedSrv: SharedService) {
    gameSrv.renderer = renderer;
  }

  @ViewChildren(CardsComponent, {read: ElementRef}) cards: QueryList<CardsComponent>;

  standardDeck: Deck = {
    id: 'dinos'
  };

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
    this.newGame(this.standardDeck);
    this.sharedSrv.currentTimesClicked.subscribe(timesClicked => this.clicked = timesClicked);
  }
}
