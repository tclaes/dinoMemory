import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { SharedService } from './../../shared/shared.service';

@Component({
    selector: 'app-clicks',
    template: `
    <div id="clicks">
      Clicks: {{nrOfClicks}}
    </div>
  `,
    styleUrls: ['./clicks.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ClicksComponent {

  nrOfClicks;

  constructor(private sharedSrv: SharedService) {
    sharedSrv.currentTimesClicked.subscribe(clicks => this.nrOfClicks = clicks);
  }
}
