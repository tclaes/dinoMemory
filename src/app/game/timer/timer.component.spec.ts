import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TimerComponent } from './timer.component';
import { TimerService } from './timer.service';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimerComponent],
      providers: [
        { provide: TimerService, useValue: { currentTime: of('0h - 1m - 5s') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('picks up the current stopwatch value from TimerService and renders it', () => {
    expect(component.stopwatch).toBe('0h - 1m - 5s');
    expect(fixture.nativeElement.textContent).toContain('0h - 1m - 5s');
  });
});
