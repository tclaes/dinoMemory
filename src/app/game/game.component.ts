import { Component, OnInit, Renderer, ViewChildren, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { GameService } from './game.service';
import { CardsComponent } from '../cards/cards.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit {


  constructor(public gameSrv: GameService, public renderer: Renderer) {
    gameSrv.renderer = renderer;
  }

  @ViewChildren(CardsComponent, {read: ElementRef}) cards: QueryList<CardsComponent>;

  ngOnInit() {
    this.gameSrv.loadGame('test');
  }

  ngAfterViewInit(): void {
    this.cards.changes.subscribe(c => {
      c.toArray().forEach(item => this.gameSrv.shuffle(item));
    });
  }
}
