import { Component, OnInit, Input } from '@angular/core';
import { DeckService } from '../../shared/deck.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {

  decks$;

  constructor(public deck: DeckService, public game: GameService) {}

  loadControls() {
    this.decks$ = this.deck.getData().then(data => data['deck'].map(x => x));
  }

  ngOnInit() {
    this.loadControls();
  }
}
