import { Directive, Input } from '@angular/core';
import { GameService } from '../game/game.service';
import { Deck } from './deck.service';


@Directive({
  exportAs: 'standardDeck',
  selector: '[appStandardDeck]'
})


export class StandardDeckDirective {

  @Input() standardDeck: Deck;

  constructor(public gameSrv: GameService) {
  }

}
