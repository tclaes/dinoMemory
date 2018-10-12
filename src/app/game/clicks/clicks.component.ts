import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from './../../shared/shared.service';

@Component({
  selector: 'app-clicks',
  template: `
    <div id="clicks">
      Clicks: {{nrOfClicks}}
    </div>
  `,
  styleUrls: ['./clicks.component.scss']
})
export class ClicksComponent {

  nrOfClicks;

  constructor(private sharedSrv: SharedService) {
    sharedSrv.currentTimesClicked.subscribe(clicks => this.nrOfClicks = clicks);
  }
}
