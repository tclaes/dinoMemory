import { Component, OnInit, Input } from '@angular/core';
import { DeckService } from '../shared/deck.service';
import { GameService } from '../game/game.service';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  decks$;
  faBars = faBars;
  faClose = faTimes;

  constructor(public deck: DeckService, public game: GameService) {}

  loadControls() {
    this.decks$ = this.deck.getData().then(data => data['deck'].map(x => x));
  }

  ngOnInit() {
    this.loadControls();
  }
}
