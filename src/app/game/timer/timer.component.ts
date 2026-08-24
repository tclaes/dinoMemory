import {Component, inject} from '@angular/core';
import {TimerService} from './timer.service';

@Component({
    selector: 'app-timer',
    template: `
    <div id="timer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="13" r="8" stroke="#1B1233" stroke-width="2.4"/><path d="M12 9v4l3 2" stroke="#1B1233" stroke-width="2.4" stroke-linecap="round"/><path d="M9 3h6" stroke="#1B1233" stroke-width="2.4" stroke-linecap="round"/></svg>
      <span class="visuallyhidden">Time:</span>
      <span>{{ stopwatch() }}</span>
    </div>
  `,
    styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {
  #timerService = inject(TimerService)

  stopwatch = this.#timerService.currentTime
}
