import {Directive, ElementRef, inject, Renderer2} from '@angular/core';

@Directive({
    exportAs: 'gameWon',
    selector: '[appGameWon]',
})

export class GameWonDirective {

  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  constructor() {
    this.renderer.removeClass(this.el.nativeElement, 'display');
    this.renderer.addClass(this.el.nativeElement, 'modal');
  }
}
