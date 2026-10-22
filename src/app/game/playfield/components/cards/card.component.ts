import {Component, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-card',
  template: `
      <img ngSrc="assets/img/{{imgUrl()}}/{{card()}}.svg" alt="{{card()}}" class="front-face" width="150" height="150">
      <div class="back-face" [style.background]="cover.bg">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="cover-star">
              <path d="M12 3l1.9 4.5L18.5 8l-3.5 3.3.9 5.2L12 14l-3.9 2.5.9-5.2L5.5 8l4.6-.5L12 3z" [attr.fill]="cover.star"
                    stroke="#1B1233" stroke-width="1.4" stroke-linejoin="round"/>
          </svg>
      </div>
      <span class="matched-badge" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l5 5L19 7" stroke="#1B1233" stroke-width="3.2"
                                                                        stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
  `,
  styleUrls: ['./card.component.scss'],
  imports: [
    NgOptimizedImage
  ]
})
export class CardComponent {

  card = input();
  imgUrl = input.required<string>();
  frontFace = input();
  coverIndex = input(0);

  private readonly covers = [
    {bg: 'var(--dd-blue-bright)', star: 'var(--dd-yellow)'},
    {bg: 'var(--dd-pink-bright)', star: 'var(--dd-yellow)'},
    {bg: 'var(--dd-yellow)', star: 'var(--dd-pink-bright)'}
  ];

  get cover() {
    return this.covers[this.coverIndex() % this.covers.length];
  }
}
