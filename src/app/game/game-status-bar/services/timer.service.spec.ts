import {TestBed} from '@angular/core/testing';

import {TimerService} from './timer.service';
import {GlobalService} from '../../global/services/global.service';
import {signal} from '@angular/core';
import {GameService} from '../../playfield/services/game.service';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

describe('TimerService', () => {
  let service: TimerService;
  let globalService: GlobalService;
  const gameWon = signal(false);

  function startGame() {
    globalService.startGame();
    TestBed.tick();
  }

  beforeEach(() => {
    vi.useFakeTimers();
    gameWon.set(false);
    TestBed.configureTestingModule({providers: [{provide: GameService, useValue: {gameWon}}]});
    service = TestBed.inject(TimerService);
    globalService = TestBed.inject(GlobalService);
    TestBed.tick();
  });

  afterEach(() => {
    globalService.stopGame();
    TestBed.tick();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts at zero', () => {
    expect(service.elapsedMs()).toBe(0);
  });

  it('should not tick while the game has not started', () => {
    vi.advanceTimersByTime(3000);

    expect(service.elapsedMs()).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should count the elapsed milliseconds once the game starts', () => {
    startGame();

    vi.advanceTimersByTime(1000);
    expect(service.elapsedMs()).toBe(1000);

    vi.advanceTimersByTime(2000);
    expect(service.elapsedMs()).toBe(3000);
  });

  it('should not run a second interval when startTimer is called while the timer is running', () => {
    startGame();

    service.startTimer();

    expect(vi.getTimerCount()).toBe(1);
  });

  it('should stop and reset the timer when the game stops', () => {
    startGame();
    vi.advanceTimersByTime(2000);
    expect(service.elapsedMs()).toBe(2000);

    globalService.stopGame();
    TestBed.tick();

    expect(service.elapsedMs()).toBe(0);
    expect(vi.getTimerCount()).toBe(0);

    vi.advanceTimersByTime(3000);
    expect(service.elapsedMs()).toBe(0);
  });

  it('should start counting from zero when the game is restarted', () => {
    startGame();
    vi.advanceTimersByTime(2000);

    globalService.stopGame();
    TestBed.tick();
    startGame();

    expect(service.elapsedMs()).toBe(0);
    vi.advanceTimersByTime(1000);
    expect(service.elapsedMs()).toBe(1000);
  });

  it('should freeze the time at the exact winning moment, not at the last tick', () => {
    startGame();
    vi.advanceTimersByTime(3720);
    expect(service.elapsedMs()).toBe(3000);

    gameWon.set(true);
    TestBed.tick();

    expect(service.elapsedMs()).toBe(3720);
    expect(vi.getTimerCount()).toBe(0);

    vi.advanceTimersByTime(3000);
    expect(service.elapsedMs()).toBe(3720);
  });

  it('should measure from the clock, so delayed ticks do not lose time', () => {
    startGame();

    // the clock jumps 59 s without any interval firing, as in a throttled background tab;
    // the single delayed tick then lands at 60 s on the clock
    vi.setSystemTime(Date.now() + 59_000);
    vi.advanceTimersToNextTimer();

    expect(service.elapsedMs()).toBe(60_000);
  });

  it('should keep counting past one hour', () => {
    startGame();

    vi.advanceTimersByTime(3_605_000);

    expect(service.elapsedMs()).toBe(3_605_000);
  });
});
