import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-card',
    template: `
    <img src="assets/img/{{imgUrl}}/{{card}}.svg" alt="{{card}}" [className]="'front-face'">
    <img src="assets/img/{{imgUrl}}/{{frontFace}}.svg" alt="Memory Card" class="back-face">
  `,
    styleUrls: ['./cards.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CardsComponent {

  @Input() card;
  @Input() imgUrl;
  @Input() frontFace;

  constructor() { }
}
