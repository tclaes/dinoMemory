import {Service, signal} from '@angular/core';

@Service()
export class GlobalService {
  #gameStarted = signal(false)
  gameStarted$ = this.#gameStarted.asReadonly();

  startGame() {
    this.#gameStarted.set(true)
  }

  stopGame() {
    this.#gameStarted.set(false)
  }
}
