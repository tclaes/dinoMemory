import { Component, OnInit, Input } from '@angular/core';

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

  constructor() {
  }

  ngOnInit() {
  }
}
