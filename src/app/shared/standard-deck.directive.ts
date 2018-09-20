import { Directive, Input } from '@angular/core';
import { GameService } from '../game/game.service';

export interface Deck {
  id: string;
}

@Directive({
  exportAs: 'standardDeck',
  selector: '[appStandardDeck]'
})


export class StandardDeckDirective {

  @Input() standardDeck: Deck;

  constructor(public gameSrv: GameService) {
  }

}
