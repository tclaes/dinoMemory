import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  data: any;

  constructor() {

   }

  update(event: Event) {
    this.data = {};
  }

  ngOnInit() {
  }

}
