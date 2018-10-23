import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GameService } from './game/game.service';
import { SharedService } from './shared/shared.service';
import { Deck } from './shared/deck.service';

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  deck: Deck;

  constructor(public gameSrv: GameService, private sharedSrv: SharedService) {
    sharedSrv.standardDeck.subscribe(deck => this.deck = deck);
    gameSrv.changeDeck(this.deck.name);
  }

  ngOnInit(): void {
  }


}
