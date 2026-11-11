import {computed, inject, Injectable, linkedSignal} from '@angular/core';
import {DeckService} from './deck.service';
import {AuthService} from '../../../core/auth/services/auth.service';
import {GlobalService} from '../../global/services/global.service';
import {BoardCard} from '../model/board';
import {Deck} from '../model/deck';
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
  // Whether the score of the current game was saved; resets when the game stops.
  // Keyed on the stop count: a linkedSignal on gameStarted$ misses a stop and start nobody read in between.
  #scoreSaved = linkedSignal<number, boolean>({
    source: this.#globalService.gamesStopped,
    computation: () => false
  });
  scoreSaved = this.#scoreSaved.asReadonly();
  gameWon = computed(() => {
    return this.board().length > 0 && this.matchedIds().size === this.board().length
  })
  // Whether the scoreboard dialog is open: opens on a win, can be closed and reopened, resets when the game stops.
  // Keyed on the stop count too: a stop and win nobody read in between would otherwise keep a manual close.
  #scoreboardOpen = linkedSignal<{won: boolean, stops: number}, boolean>({
    source: () => ({won: this.gameWon(), stops: this.#globalService.gamesStopped()}),
    computation: ({won}) => won
  });
  scoreboardOpen = this.#scoreboardOpen.asReadonly();


  board =linkedSignal<{started: boolean, deck: Deck | undefined}, BoardCard[]>({
    source: () => ({started: this.#globalService.gameStarted$(), deck: this.deck()}),
    computation: ({started, deck}, previous) => {
      if (started && previous) {
        return previous.value;
      }
      return this.#shuffle(deck?.pairs ? this.#buildPairedCards(deck) : this.#buildIdenticalCards(deck));
    }
  });
  #lockBoard = false;
  #unflipTimeout: ReturnType<typeof setTimeout>;

  markScoreSaved() {
    this.#scoreSaved.set(true);
  }

  openScoreboard() {
    if (this.gameWon()) {
      this.#scoreboardOpen.set(true);
    }
  }

  closeScoreboard() {
    this.#scoreboardOpen.set(false);
  }

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

  #buildIdenticalCards(deck: Deck | undefined): BoardCard[] {
    return (deck?.cards ?? []).flatMap((name, i) => [
      {id: `${name}-a`, name, coverIndex: i},
      {id: `${name}-b`, name, coverIndex: i + 1}
    ]);
  }

  #buildPairedCards(deck: Deck): BoardCard[] {
    const available = deck.pairs.filter(pair => pair.phase <= (deck.maxPhase ?? Infinity));
    const chosen = this.#shuffle(available).slice(0, deck.pairsPerGame ?? available.length);
    return chosen.flatMap((pair, i): BoardCard[] => [
      {
        id: `${pair.key}-letter`, name: pair.letter, pairKey: pair.key, coverIndex: i,
        face: {kind: 'letter', text: pair.letter}
      },
      {
        id: `${pair.key}-word`, name: pair.word, pairKey: pair.key, coverIndex: i + 1,
        face: {kind: 'word', text: pair.word, emoji: pair.emoji, highlight: pair.highlight}
      }
    ]);
  }

  #checkForMatch() {
    const [first, second] = this.#flippedIds().map(id => this.board().find(card => card.id === id));
    if ((first.pairKey ?? first.name) === (second.pairKey ?? second.name)) {
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
