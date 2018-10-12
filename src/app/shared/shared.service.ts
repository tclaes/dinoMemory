import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TimerService } from '../game/timer/timer.service';
import { Deck } from './deck.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private timesClicked = new BehaviorSubject<number>(1);
  currentTimesClicked = this.timesClicked.asObservable();

  private deck = new BehaviorSubject<Deck>({
    name: 'dinos'
  });
  standardDeck = this.deck.asObservable();

  cardClicked(clicks) {
    this.timesClicked.next(clicks);
  }

  setDeck(deck: Deck) {
    console.log(`Standarddeck set to ${deck.imgUrl}`);
    this.deck.next(deck);
  }
}
