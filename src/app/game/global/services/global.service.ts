import {Service, signal} from '@angular/core';

@Service()
export class GlobalService {
  #gameStarted = signal(false)
  gameStarted$ = this.#gameStarted.asReadonly();
  // Counts the stops, so state tied to one game resets even if nothing read it while the game was stopped.
  #gamesStopped = signal(0);
  gamesStopped = this.#gamesStopped.asReadonly();

  startGame() {
    this.#gameStarted.set(true)
  }

  stopGame() {
    this.#gameStarted.set(false)
    this.#gamesStopped.update(n => n + 1)
  }
}
