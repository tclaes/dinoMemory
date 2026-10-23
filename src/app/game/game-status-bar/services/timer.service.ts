import {effect, inject, Injectable, linkedSignal} from '@angular/core';
import {GlobalService} from '../../global/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  #globalService = inject(GlobalService);
  // resets to zero whenever the game starts or stops
  #timer = linkedSignal({
    source: this.#globalService.gameStarted$,
    computation: () => '0h - 0m - 0s',
  });
  currentTime = this.#timer.asReadonly();
  intervalId: ReturnType<typeof setInterval>;

  constructor() {
    effect(() => {
      if (this.#globalService.gameStarted$()) {
        this.startTimer();
      } else {
        this.#stopTimer();
      }
    });
  }

   startTimer() {
     this.#stopTimer();
     let hours = 0;
     let minutes = 0;
     let seconds = 0;

    this.intervalId = setInterval(() => {
      if (seconds < 59) {
        seconds++;
      } else {
        seconds = 0;
        if (minutes < 59) {
          minutes++;
        } else {
          if (hours < 24) {
            hours++;
          }
        }
      }
      this.#timer.set(`${hours}h - ${minutes}m - ${seconds}s`);
    }, 1000)
   }

   #stopTimer() {
     clearInterval(this.intervalId);
   }

   resetTimer() {
     this.#stopTimer()
     this.#timer.set(`0h - 0m - 0s`);
   }

}
