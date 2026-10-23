import {computed, inject, Injectable, signal} from '@angular/core';
import {DeckService} from './deck.service';
import {AuthService} from '../../../core/auth/services/auth.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {BoardCard} from '../model/board';

@Injectable({providedIn: 'root'})
export class GameService {
  #authService = inject(AuthService);
  #deckService = inject(DeckService);

  user = toSignal(this.#authService.User);
  deck = this.#deckService.selectedDeck;
  #flippedIds = signal<readonly string[]>([]);
  flippedIds = this.#flippedIds.asReadonly();
  #matchedIds = signal<ReadonlySet<string>>(new Set());
  matchedIds = this.#matchedIds.asReadonly();
  faceUpIds = computed(() => new Set([...this.#flippedIds(), ...this.#matchedIds()]));
  gameWon = computed(() => {
    return this.matchedIds().size === this.board().length
  })

  #generation = signal(0);
  board = computed<BoardCard[]>(() => {
    this.#generation();
    const names = this.deck()?.cards ?? [];
    const pairs = names.flatMap((name, i) => [
      {id: `${name}-a`, name, coverIndex: i},
      {id: `${name}-b`, name, coverIndex: i + 1}
    ]);
    return this.#shuffle(pairs);
  });
  #lockBoard = false;
  #unflipTimeout: ReturnType<typeof setTimeout>;

  flipCard(id: string) {
    if (this.faceUpIds().has(id)) {
      return;
    }
    if (this.#lockBoard) {
      return;
    }

    this.#flippedIds.update(flipped => [...flipped, id]);
    if (this.#flippedIds().length === 2) {
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
