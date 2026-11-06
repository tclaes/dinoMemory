import {effect, inject, Injectable, linkedSignal} from '@angular/core';
import {GlobalService} from '../../global/services/global.service';
import {GameService} from '../../playfield/services/game.service';

const TICK_MS = 1000;

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  #globalService = inject(GlobalService);
  #gameService = inject(GameService);
  // resets to zero whenever the game starts or stops
  #elapsedMs = linkedSignal({
    source: this.#globalService.gameStarted$,
    computation: () => 0,
  });
  /** Milliseconds elapsed since the game started, frozen at the winning moment. */
  elapsedMs = this.#elapsedMs.asReadonly();
  #intervalId: ReturnType<typeof setInterval> | undefined;
  #startedAt: number | undefined;

  constructor() {
    effect(() => {
      const started = this.#globalService.gameStarted$();
      const won = this.#gameService.gameWon();
      if (started && !won) {
        this.startTimer();
      } else if (started && won) {
        this.#freezeTimer();
      } else {
        this.#stopTimer();
      }
    });
  }

  startTimer() {
    this.#stopTimer();
    this.#startedAt = Date.now();
    this.#intervalId = setInterval(() => this.#measure(), TICK_MS);
  }

  #measure() {
    if (this.#startedAt !== undefined) {
      this.#elapsedMs.set(Date.now() - this.#startedAt);
    }
  }

  // take one last exact reading, so the final time is the winning moment and not the last tick
  #freezeTimer() {
    if (this.#intervalId !== undefined) {
      this.#measure();
    }
    this.#stopTimer();
  }

  #stopTimer() {
    clearInterval(this.#intervalId);
    this.#intervalId = undefined;
    this.#startedAt = undefined;
  }
}
