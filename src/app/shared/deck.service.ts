import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {filter, switchMap} from 'rxjs/operators';
import {toSignal} from '@angular/core/rxjs-interop';

export interface Deck {
  name: string;
  imgURL?: string;
  frontFace?: string;
  cards?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  http = inject(HttpClient)

  decksUrl = '../../assets/data.json';
  #decks = toSignal<{deck: Deck[]}>(this.http.get(this.decksUrl));
  #selected = signal('dinos')
  selectedDeck = computed(() => {
    return this.#decks()?.deck?.find(deck => deck.name === this.#selected())
  })
  availableDecks = computed(() => {
    return this.#decks()?.deck
  })


  selectDeck(name: string) {
    this.#selected.set(name);
  }

  getDataObservable() {
    return this.http
      .get(this.decksUrl);
  }

  setDeckObservable(e) {
    const data = this.getDataObservable();
    return data.pipe(
      switchMap(x => x['deck']),
      filter(x => x['name'] === e)
    );
  }




}
