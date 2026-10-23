import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {toSignal} from '@angular/core/rxjs-interop';
import {Deck} from '../model/deck';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  http = inject(HttpClient);

  decksUrl = '../../assets/data.json';
  #decks = toSignal<{ deck: Deck[] }>(this.http.get(this.decksUrl));
  availableDecks = computed(() => this.#decks()?.deck);
  #selected = signal('dinos');
  selectedDeck = computed(() => this.#decks()?.deck?.find(deck => deck.name === this.#selected()));

  selectDeck(name: string) {
    this.#selected.set(name);
  }
}
