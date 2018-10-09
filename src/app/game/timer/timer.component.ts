import { Component, OnInit, Input } from '@angular/core';
import { timeout } from 'q';
import { GameService } from '../../game/game.service';

@Component({
  selector: 'app-timer',
  template: `
    <div id="timer">
    <p>Time:</p>
      {{timer}}
    </div>
  `,
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  @Input() timer;

  constructor() {
   }

  ngOnInit() {
  }

}
