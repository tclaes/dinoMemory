import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';

import { TimerService } from './timer.service';

describe('TimerService', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts at the zeroed stopwatch value', () => {
    expect(service.currentTime()).toBe('0h - 0m - 0s');
  });

  it('startTimer() advances one second per tick', fakeAsync(() => {
    service.startTimer();

    tick(1000);
    expect(service.currentTime()).toBe('0h - 0m - 1s');
    tick(1000);
    expect(service.currentTime()).toBe('0h - 0m - 2s');
    tick(1000);
    expect(service.currentTime()).toBe('0h - 0m - 3s');

    discardPeriodicTasks();
  }));

  it('rolls seconds over into minutes after 60 ticks', fakeAsync(() => {
    service.startTimer();

    for (let i = 0; i < 60; i++) {
      tick(1000);
    }
    expect(service.currentTime()).toBe('0h - 1m - 0s');

    discardPeriodicTasks();
  }));

  it('resetTimer() stops the timer and zeroes the stopwatch value', fakeAsync(() => {
    service.startTimer();
    tick(3000);

    service.resetTimer();
    expect(service.currentTime()).toBe('0h - 0m - 0s');

    tick(3000);
    expect(service.currentTime()).toBe('0h - 0m - 0s');
  }));
});
