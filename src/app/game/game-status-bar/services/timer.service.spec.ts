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

  it('starts at the zeroed stopwatch value', () => {
    expect(service.currentTime()).toBe('0h - 0m - 0s');
  });

  it('should not tick while the game has not started', () => {
    vi.advanceTimersByTime(3000);

    expect(service.currentTime()).toBe('0h - 0m - 0s');
  });

  it('should start the timer when the game starts', () => {
    globalService.startGame();
    TestBed.tick();

    vi.advanceTimersByTime(1000);
    expect(service.currentTime()).toBe('0h - 0m - 1s');

    vi.advanceTimersByTime(2000);
    expect(service.currentTime()).toBe('0h - 0m - 3s');
  });

  it('should not run a second interval when startTimer is called while the timer is running', () => {
    globalService.startGame();
    TestBed.tick();

    service.startTimer();

    expect(vi.getTimerCount()).toBe(1);
  });

  it('should stop and reset the timer when the game stops', () => {
    globalService.startGame();
    TestBed.tick();
    vi.advanceTimersByTime(2000);
    expect(service.currentTime()).toBe('0h - 0m - 2s');

    globalService.stopGame();
    TestBed.tick();

    expect(service.currentTime()).toBe('0h - 0m - 0s');
    expect(vi.getTimerCount()).toBe(0);

    vi.advanceTimersByTime(3000);
    expect(service.currentTime()).toBe('0h - 0m - 0s');
  });

  it('should start counting from zero when the game is restarted', () => {
    globalService.startGame();
    TestBed.tick();
    vi.advanceTimersByTime(2000);

    globalService.stopGame();
    TestBed.tick();
    globalService.startGame();
    TestBed.tick();

    expect(service.currentTime()).toBe('0h - 0m - 0s');
    vi.advanceTimersByTime(1000);
    expect(service.currentTime()).toBe('0h - 0m - 1s');
  });

  it('should freeze the time when the game is won', () => {
    globalService.startGame();
    TestBed.tick();
    vi.advanceTimersByTime(2000);

    gameWon.set(true);
    TestBed.tick();
    vi.advanceTimersByTime(3000);

    expect(service.currentTime()).toBe('0h - 0m - 2s');
    expect(vi.getTimerCount()).toBe(0);
  });
});
