import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GameService } from './game/game.service';

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  constructor(public gameSrv: GameService) {}

  ngOnInit(): void {
  }

}
