import {Component} from '@angular/core';
import {TimerComponent} from '../timer/timer.component';
import {ClicksComponent} from '../clicks/clicks.component';
import {RestartComponent} from '../restart/restart.component';

@Component({
  selector: 'app-game-status-bar',
  styleUrls: ['./game-status-bar.component.scss'],
  imports: [
    TimerComponent,
    ClicksComponent,
    RestartComponent
  ],
  template: `
      <app-clicks />
      <app-timer />
      <app-restart />
  `
})
export class GameStatusBarComponent {}
