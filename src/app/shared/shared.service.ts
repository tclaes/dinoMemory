import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TimerService } from '../game/timer/timer.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private timesClicked = new BehaviorSubject<number>(0);
  currentTimesClicked = this.timesClicked.asObservable();

  constructor(private timerSrv: TimerService) { }

  cardClicked(clicks) {
    console.log(`Clicks in gameservice ${clicks}`);
    this.timesClicked.next(clicks);
  }
}
