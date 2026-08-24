import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  #timer = signal('0h - 0m - 0s')
  currentTime = computed(() => {
    return this.#timer()
  });
  intervalId: number;

   startTimer() {
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
