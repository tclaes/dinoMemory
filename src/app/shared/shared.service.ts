import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Deck } from './deck.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  _deck: Deck;

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
    this.deck.next(deck);
  }
}
