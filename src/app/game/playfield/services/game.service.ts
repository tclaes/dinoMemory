import {computed, inject, Injectable, linkedSignal} from '@angular/core';
import {DeckService} from './deck.service';
import {AuthService} from '../../../core/auth/services/auth.service';
import {GlobalService} from '../../global/services/global.service';
import {BoardCard} from '../model/board';
import {ClicksService} from '../../game-status-bar/services/clicks.service';

@Injectable({providedIn: 'root'})
export class GameService {
  #authService = inject(AuthService);
  #clickService = inject(ClicksService);
  #deckService = inject(DeckService);
  #globalService = inject(GlobalService);

  user = this.#authService.User;
  deck = this.#deckService.selectedDeck;
  #flippedIds = linkedSignal<boolean, readonly string[]>({
    source: this.#globalService.gameStarted$,
    computation: (started, previous) => started && previous ? previous.value : []
  });
  flippedIds = this.#flippedIds.asReadonly();
  #matchedIds = linkedSignal<boolean, ReadonlySet<string>>({
    source: this.#globalService.gameStarted$,
    computation: (started, previous) => started && previous ? previous.value : new Set()
  });
  matchedIds = this.#matchedIds.asReadonly();
  faceUpIds = computed(() => new Set([...this.#flippedIds(), ...this.#matchedIds()]));
  gameWon = computed(() => {
    return this.matchedIds().size === this.board().length
  })


  board = linkedSignal<{started: boolean, deck: readonly string[]}, BoardCard[]>({
    source: () => ({started: this.#globalService.gameStarted$(), deck: this.deck()?.cards ?? []}),
    computation: ({started, deck}, previous) => {
      if (started && previous) {
        return previous.value;
      }
      const pairs = deck.flatMap((name, i) => [
        {id: `${name}-a`, name, coverIndex: i},
        {id: `${name}-b`, name, coverIndex: i + 1}
      ]);
      return this.#shuffle(pairs);
    }
  });
  #lockBoard = false;
  #unflipTimeout: ReturnType<typeof setTimeout>;

  flipCard(id: string) {
    if(!this.#globalService.gameStarted$()) {
      this.#globalService.startGame();
    }
    if (this.faceUpIds().has(id)) {
      return;
    }
    if (this.#lockBoard) {
      return;
    }

    this.#flippedIds.update(flipped => [...flipped, id]);
    if (this.#flippedIds().length === 2) {
      this.#clickService.increment()
      this.#lockBoard = true;
      this.#checkForMatch();
    }
  }

  #checkForMatch() {
    const [first, second] = this.#flippedIds().map(id => this.board().find(card => card.id === id));
    if (first.name === second.name) {
      this.#matchedIds.update(matched => new Set([...matched, first.id, second.id]));
      return this.#unlockBoard();
    }

    this.#unflipTimeout = setTimeout(() => this.#unlockBoard(), 1000);
  }

  #unlockBoard() {
    clearTimeout(this.#unflipTimeout);
    this.#flippedIds.set([]);
    this.#lockBoard = false;
  }

  #shuffle<T>(items: T[]): T[] {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
