import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../../game/game.service';

@Component({
  selector: 'app-clicks',
  template: `
    <div id="clicks">
      Clicks: {{nrOfClicks}}
    </div>
  `,
  styleUrls: ['./clicks.component.css']
})
export class ClicksComponent implements OnInit {

  @Input() nrOfClicks: number;

  constructor(private gameSrv: GameService) {
    this.nrOfClicks = this.gameSrv.nrOfClicks;
  }

  ngOnInit() {
  }
}
