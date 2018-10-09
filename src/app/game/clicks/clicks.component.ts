import { Component, OnInit, Input } from '@angular/core';

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

  @Input() nrOfClicks: number;

  constructor() {
  }
}
