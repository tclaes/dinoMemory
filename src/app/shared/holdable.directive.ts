import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {interval, Observable, Subject} from 'rxjs';
import {filter, takeUntil, tap} from 'rxjs/operators';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[holdable]',
})
export class HoldableDirective {

  @Output() holdTime: EventEmitter<number> = new EventEmitter();

  state: Subject<string> = new Subject();
  cancel: Observable<string>;

  constructor() {
    this.cancel = this.state.pipe(
      filter(v => v === 'cancel'),
      tap(v => {
        this.holdTime.emit(0);
      })
    );
   }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  onExit() {
    this.state.next('cancel');
  }

  @HostListener('mousedown')
  onHold() {
    // console.log('%c started hold', 'color: #5fba7d; font-weight: bold');
    this.state.next('start');
    const n = 100;
    interval(n).pipe(
      takeUntil(this.cancel),
      tap(v => {
        this.holdTime.emit(v * n);
      })
    )
    .subscribe();
  }

}
