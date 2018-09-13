import { Component, OnInit, Renderer } from '@angular/core';
import { GameService } from './game.service';

export interface Deck {
  name: string;
  imgUrl: string;
  frontFace: string;
  cards: Array<string>;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(public gameSrv: GameService, public renderer: Renderer) {
    gameSrv.renderer = renderer;
  }

  ngOnInit() {
    this.gameSrv.loadGame('test');
  }
}
