import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-card',
  template: `
    <img src="assets/img/{{gameSrv.imgUrl}}/{{card}}.svg" alt="{{card}}" [className]="'front-face'">
    <img src="assets/img/{{gameSrv.imgUrl}}/{{gameSrv.frontFace}}.svg" alt="Memory Card" class="back-face">
  `,
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  @Input() card;

  constructor( public gameSrv: GameService) { }

  ngOnInit() {
  }

}
