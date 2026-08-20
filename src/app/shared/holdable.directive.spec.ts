import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HoldableDirective } from './holdable.directive';

@Component({
  template: `<div holdable (holdTime)="record($event)"></div>`
})
class TestHostComponent {
  values: number[] = [];
  record(v: number) {
    this.values.push(v);
  }
}

describe('HoldableDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let div: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HoldableDirective, TestHostComponent]
    });
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    div = fixture.nativeElement.querySelector('div');
  });

  it('emits an increasing hold time every 100ms while the mouse is held down', fakeAsync(() => {
    div.dispatchEvent(new Event('mousedown'));
    tick(100);
    tick(100);
    tick(100);

    expect(host.values).toEqual([0, 100, 200]);

    div.dispatchEvent(new Event('mouseup'));
    tick();
  }));

  it('stops emitting and reports 0 once the mouse is released', fakeAsync(() => {
    div.dispatchEvent(new Event('mousedown'));
    tick(100);
    tick(100);

    div.dispatchEvent(new Event('mouseup'));
    tick();

    expect(host.values).toEqual([0, 100, 0]);

    tick(500);
    expect(host.values).toEqual([0, 100, 0]);
  }));

  it('also cancels the hold when the mouse leaves the element', fakeAsync(() => {
    div.dispatchEvent(new Event('mousedown'));
    tick(100);

    div.dispatchEvent(new Event('mouseleave'));
    tick();

    expect(host.values).toEqual([0, 0]);
  }));
});
