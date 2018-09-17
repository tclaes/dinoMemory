import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DeckService } from './shared/deck.service';
import { GameService } from './game/game.service';

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(private gameSrv: GameService) {}

  @ViewChild('won') win: ElementRef;

  ngOnInit(): void {
    // this.loadGame(this.deck);
  }

  ngAfterViewInit(): void {
    this.gameSrv.modalWon = this.win.nativeElement;
  }
}
