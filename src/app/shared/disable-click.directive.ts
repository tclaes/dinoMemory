import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableClick]'
})
export class DisableClickDirective {

  clicked = false;

  constructor() { }

  @HostListener('appDisableClick:click', ['$event.target'])
  onClick(event) {
      console.log('test');
      // event.preventDefault();
      // event.stopPropagation();
      return false;
  }

}
