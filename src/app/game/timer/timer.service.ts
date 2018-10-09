import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private timer;

  constructor() {

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    this.timer = interval(1000).pipe(
      map(tick => {

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
        // console.log(`${hours}h - ${minutes}m - ${seconds}s`);
      return `${hours}h - ${minutes}m - ${seconds}s`;
      })
    );
   }

   getTimer() {
     return this.timer;
   }



}
