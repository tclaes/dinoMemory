import { Component, OnInit } from '@angular/core';
import { DeckService } from '../shared/deck.service';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  decks$;

  constructor(public deck: DeckService, public game: GameService) {}

  loadControls() {
    this.decks$ = this.deck.getData().then(data => data['deck'].map(x => x));
  }

  ngOnInit() {
    this.loadControls();
  }

}
