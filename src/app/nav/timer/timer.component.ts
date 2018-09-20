import { Component, OnInit, Input } from '@angular/core';
import { timeout } from 'q';
import { GameService } from '../../game/game.service';

@Component({
  selector: 'app-timer',
  template: `
    <div id="timer">
      {{timer}}
    </div>
  `,
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  @Input() timer;

  constructor(private gameSrv: GameService) {
    this.timer = this.gameSrv.timer;
   }

  ngOnInit() {
  }

}
