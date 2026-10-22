import {Component, inject, OnInit} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {GameService} from '../../services/game.service';
import {DeckService} from '../../services/deck.service';
import {DeckComponent} from '../deck/deck.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [
    DeckComponent,
    JsonPipe
  ]
})

export class GameComponent implements OnInit {
  gameSrv = inject(GameService);
  #deckService = inject(DeckService);
  deck = this.#deckService.selectedDeck;

  ngOnInit(): void {
    this.gameSrv.newGame();
  }
}
