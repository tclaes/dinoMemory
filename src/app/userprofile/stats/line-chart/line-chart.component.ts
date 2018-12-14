import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  data: any;

  constructor() {
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'Clicks',
              data: [1, 2, 5, 3, 10, 8, 6]
          }
      ]
  }
   }


  ngOnInit() {
  }

}
