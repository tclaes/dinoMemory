import {computed, inject, Injectable, signal} from '@angular/core';
import {DeckService} from './deck.service';
import {ScoreService} from '../../scoreboard/score.service';
import {TimerService} from '../../timer/timer.service';
import {AuthService} from '../../../core/auth/services/auth.service';
import {toSignal} from '@angular/core/rxjs-interop';

export interface BoardCard {
  id: string;
  name: string;
  coverIndex: number;
}

@Injectable({providedIn: 'root'})
export class GameService {

  gameWon = false;
  gameStarted = signal(false);
  #flippedIds = signal<readonly string[]>([]);
  flippedIds = this.#flippedIds.asReadonly();
  #matchedIds = signal<ReadonlySet<string>>(new Set());
  matchedIds = this.#matchedIds.asReadonly();
  faceUpIds = computed(() => new Set([...this.#flippedIds(), ...this.#matchedIds()]));
  #clicked = signal(0);
  clicked = this.#clicked.asReadonly();
  #deckService = inject(DeckService);
  deck = this.#deckService.selectedDeck;
  #scoreService = inject(ScoreService);
  #timerService = inject(TimerService);
  timer = this.#timerService.currentTime;
  #authService = inject(AuthService);
  user = toSignal(this.#authService.User);

  // Bumped on every newGame() so the board is rebuilt and reshuffled, also when
  // restarting with the same deck.
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

  newGame(deck = 'dinos') {
    this.gameStarted.set(false);
    this.gameWon = false;
    this.#timerService.resetTimer();
    this.#resetBoard();
    this.#matchedIds.set(new Set());
    this.#generation.update(g => g + 1);
    this.changeDeck(deck);
  }

  restart() {
    this.newGame(this.deck().name);
  }

  changeDeck(deck: string) {
    this.#deckService.selectDeck(deck);
  }

  flipCard(id: string) {
    if (this.faceUpIds().has(id)) {
      return;
    }
    if (!this.gameStarted()) {
      this.#timerService.startTimer();
      this.gameStarted.set(true);
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
      this.#checkWin();
      this.#resetBoard();
    } else {
      this.#unflipTimeout = setTimeout(() => this.#resetBoard(), 1000);
    }
  }

  #checkWin() {
    if (this.#matchedIds().size === this.board().length) {
      this.gameWon = !this.gameWon;
      let clicks: number;
      this.#scoreService.updateScores(this.user().displayName, clicks, this.timer(), this.deck().name);
    }
  }

  #resetBoard() {
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
