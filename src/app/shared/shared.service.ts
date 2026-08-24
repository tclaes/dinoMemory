import {computed, Injectable, signal} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Deck} from './deck.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private timesClicked = new BehaviorSubject<number>(1);
  currentTimesClicked = this.timesClicked.asObservable();

  #deck = signal<Deck>({name: 'dinos'})
  standardDeck = computed(() => {
    return this.#deck()
  });

  cardClicked(clicks: number) {
    this.timesClicked.next(clicks);
  }
}
