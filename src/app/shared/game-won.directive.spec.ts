import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameWonDirective } from './game-won.directive';

@Component({
  template: `<div appGameWon class="display"></div>`
})
class TestHostComponent { }

describe('GameWonDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameWonDirective, TestHostComponent]
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('removes the "display" class and adds the "modal" class to its host on creation', () => {
    const hostEl: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(hostEl.classList.contains('display')).toBe(false);
    expect(hostEl.classList.contains('modal')).toBe(true);
  });
});
