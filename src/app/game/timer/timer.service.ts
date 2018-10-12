import { Injectable } from '@angular/core';
import { interval, BehaviorSubject } from 'rxjs';
import { map, takeUntil, take, takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private timerSubject = new BehaviorSubject<string>('0h - 0m - 0s');
  currentTime = this.timerSubject.asObservable();
  timer;
  $stop = false;

  constructor() {
   }

   startTimer() {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    this.timer = interval(1000).pipe(
      map(() => {
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
        this.timerSubject.next(`${hours}h - ${minutes}m - ${seconds}s`);
      })
    );
   }

   getTimer() {
     return this.timer;
   }



}
