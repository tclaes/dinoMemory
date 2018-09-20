import { Directive, Renderer2, ElementRef } from '@angular/core';

@Directive({
  exportAs: 'gameWon',
  selector: '[appGameWon]'
})

export class GameWonDirective {

  constructor( private renderer: Renderer2, private el: ElementRef) {
    this.renderer.removeClass(this.el.nativeElement, 'display');
    this.renderer.addClass(this.el.nativeElement, 'won');
  }

}
