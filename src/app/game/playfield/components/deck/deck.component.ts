import {Component, inject} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {GameService} from '../../services/game.service';
import {CardComponent} from '../cards/card.component';

@Component({
  selector: 'app-deck',
  imports: [
    CardComponent,
    JsonPipe
  ],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.css',
})
export class DeckComponent {
  gameService = inject(GameService);
  deck = this.gameService.deck;

  flipCard(id: string) {
    this.gameService.flipCard(id);
  }
}
