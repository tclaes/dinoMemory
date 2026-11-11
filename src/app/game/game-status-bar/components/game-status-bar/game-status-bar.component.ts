import {Component} from '@angular/core';
import {TimerComponent} from '../timer/timer.component';
import {ClicksComponent} from '../clicks/clicks.component';
import {RestartComponent} from '../restart/restart.component';
import {ShowScoresComponent} from '../show-scores/show-scores.component';

@Component({
  selector: 'app-game-status-bar',
  styleUrls: ['./game-status-bar.component.scss'],
  imports: [
    TimerComponent,
    ClicksComponent,
    RestartComponent,
    ShowScoresComponent
  ],
  template: `
      <app-clicks />
      <app-timer />
      <app-show-scores />
      <app-restart />
  `
})
export class GameStatusBarComponent {}
