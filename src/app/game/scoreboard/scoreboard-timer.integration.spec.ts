import {Component, inject, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {ScoreboardComponent} from './scoreboard.component';
import {ScoreService} from './score.service';
import {GameService} from '../playfield/services/game.service';
import {ClicksService} from '../game-status-bar/services/clicks.service';
import {GlobalService} from '../global/services/global.service';
import {TimerComponent} from '../game-status-bar/components/timer/timer.component';

const gameWon = signal(false);

// like the game page: the status bar timer runs from the start, the scoreboard appears on win
@Component({
  imports: [TimerComponent, ScoreboardComponent],
  template: `<app-timer/> @if (gameWon()) { <app-scoreboard/> }`,
})
class GamePageHost {
  gameWon = inject(GameService).gameWon;
}

describe('Scoreboard with the real timer', () => {
  const scoreService = {loadScores: vi.fn(() => of([])), updateScores: vi.fn()};
  const scoreSaved = signal(false);

  beforeEach(() => {
    vi.useFakeTimers();
    gameWon.set(false);
    scoreSaved.set(false);
    scoreService.updateScores.mockClear();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GameService,
          useValue: {
            gameWon,
            user: signal({displayName: 'Rex'}),
            deck: signal({name: 'dinos'}),
            scoreSaved,
            markScoreSaved: () => scoreSaved.set(true),
            scoreboardOpen: gameWon,
            closeScoreboard: () => undefined,
          },
        },
        {provide: ScoreService, useValue: scoreService},
        {provide: ClicksService, useValue: {countedClicks: signal(8)}},
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('saves the exact winning time, not the time of the last tick', () => {
    TestBed.createComponent(GamePageHost);
    TestBed.inject(GlobalService).startGame();
    TestBed.tick();

    vi.advanceTimersByTime(3720);
    gameWon.set(true);
    TestBed.tick();

    expect(scoreService.updateScores).toHaveBeenCalledTimes(1);
    expect(scoreService.updateScores).toHaveBeenCalledWith('Rex', 8, 3720, 'dinos');
  });
});
