import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {signal} from '@angular/core';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {ScoreboardComponent} from './scoreboard.component';
import {GameService} from '../playfield/services/game.service';
import {ScoreService} from './score.service';
import {TimerService} from '../game-status-bar/services/timer.service';
import {ClicksService} from '../game-status-bar/services/clicks.service';
import {GlobalService} from '../global/services/global.service';

describe('ScoreboardComponent', () => {
  const user = signal<{ displayName: string } | null>({displayName: 'Rex'});
  const scoreService = {
    loadScores: vi.fn(),
    updateScores: vi.fn()
  };
  const globalService = {stopGame: vi.fn()};
  const scoreSaved = signal(false);
  const markScoreSaved = vi.fn(() => scoreSaved.set(true));

  function setup() {
    TestBed.configureTestingModule({
      providers: [
        {provide: GameService, useValue: {user, deck: signal({name: 'dinos'}), scoreSaved, markScoreSaved}},
        {provide: ScoreService, useValue: scoreService},
        {provide: TimerService, useValue: {elapsedMs: signal(30500)}},
        {provide: ClicksService, useValue: {countedClicks: signal(8)}},
        {provide: GlobalService, useValue: globalService}
      ]
    });
    const fixture = TestBed.createComponent(ScoreboardComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    user.set({displayName: 'Rex'});
    scoreSaved.set(false);
    scoreService.loadScores.mockReturnValue(of([]));
  });

  it('shows the tries and the time', () => {
    const text = setup().nativeElement.textContent;

    expect(text).toContain('8 tries');
    expect(text).toContain('00:30');
  });

  it('shows the time of each listed score as a clock', () => {
    scoreService.loadScores.mockReturnValue(of([{user: 'Rex', deck: 'dinos', clicks: 8, durationMs: 65300}]));

    const fixture = setup();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('td.mat-column-time').textContent.trim()).toBe('01:05');
  });

  it('saves the score once and loads the scores of the deck when a user is signed in', () => {
    setup();

    expect(scoreService.updateScores).toHaveBeenCalledTimes(1);
    expect(scoreService.updateScores).toHaveBeenCalledWith('Rex', 8, 30500, 'dinos');
    expect(scoreService.loadScores).toHaveBeenCalledWith('dinos');
  });

  it('does not save the score again when the scoreboard is re-created for the same win', () => {
    setup();
    TestBed.resetTestingModule();
    setup();

    expect(scoreService.updateScores).toHaveBeenCalledTimes(1);
    expect(markScoreSaved).toHaveBeenCalledTimes(1);
  });

  it('does not save a score without a user but still loads the scores', () => {
    user.set(null);
    setup();

    expect(scoreService.updateScores).not.toHaveBeenCalled();
    expect(scoreService.loadScores).toHaveBeenCalledWith('dinos');
  });

  it('newGame() stops the game', () => {
    setup().componentInstance.newGame();

    expect(globalService.stopGame).toHaveBeenCalled();
  });
});
