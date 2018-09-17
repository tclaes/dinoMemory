import { Component, OnInit, Renderer, ViewChildren, Input, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { GameService } from './game.service';
import { CardsComponent } from '../cards/cards.component';
import { StandardDeckDirective, Deck } from '../shared/standard-deck.directive';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit, AfterViewInit {

  constructor(public gameSrv: GameService, public renderer: Renderer) {
    gameSrv.renderer = renderer;
  }

  @ViewChildren(CardsComponent, {read: ElementRef}) cards: QueryList<CardsComponent>;

  standardDeck: Deck = {
    id: 'test'
  };

  ngOnInit() {
    this.gameSrv.standardDeck = this.standardDeck;
    this.gameSrv.newGame(this.standardDeck);
  }

  ngAfterViewInit(): void {
    this.cards.changes.subscribe(c => {
      c.toArray().forEach(item => this.gameSrv.shuffle(item));
    });
  }
}
