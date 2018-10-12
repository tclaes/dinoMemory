import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TimerService } from './timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  template: `
    <div id="timer">
    <p>Time:</p>
      {{ stopwatch }}
    </div>
  `,
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {

  stopwatch;

  constructor(private timerSrv: TimerService) {
    timerSrv.currentTime.subscribe(time => this.stopwatch = time);
   }

}
