import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';

import { TimerService } from './timer.service';

describe('TimerService', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(TimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTimer() returns undefined before startTimer() has been called', () => {
    expect(service.getTimer()).toBeUndefined();
  });

  it('resetTimer() emits the zeroed stopwatch value', () => {
    let value: string;
    service.currentTime.subscribe(v => value = v);
    service.resetTimer();
    expect(value).toBe('0h - 0m - 0s');
  });

  it('startTimer() emits one second per tick once subscribed', fakeAsync(() => {
    let value: string;
    service.currentTime.subscribe(v => value = v);

    service.startTimer();
    service.getTimer().subscribe();

    tick(1000);
    expect(value).toBe('0h - 0m - 1s');
    tick(1000);
    expect(value).toBe('0h - 0m - 2s');
    tick(1000);
    expect(value).toBe('0h - 0m - 3s');

    discardPeriodicTasks();
  }));

  it('rolls seconds over into minutes after 60 ticks', fakeAsync(() => {
    let value: string;
    service.currentTime.subscribe(v => value = v);

    service.startTimer();
    service.getTimer().subscribe();

    for (let i = 0; i < 60; i++) {
      tick(1000);
    }
    expect(value).toBe('0h - 1m - 0s');

    discardPeriodicTasks();
  }));
});
