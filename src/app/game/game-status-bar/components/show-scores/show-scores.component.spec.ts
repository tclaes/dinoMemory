import {signal} from '@angular/core';
import {fireEvent, render, screen} from '@testing-library/angular';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {ShowScoresComponent} from './show-scores.component';
import {GameService} from '../../../playfield/services/game.service';

describe('ShowScoresComponent', () => {
  const gameWon = signal(false);
  const scoreboardOpen = signal(false);
  const openScoreboard = vi.fn();

  const renderComponent = () => render(ShowScoresComponent, {
    providers: [{provide: GameService, useValue: {gameWon, scoreboardOpen, openScoreboard}}]
  });

  beforeEach(() => {
    vi.clearAllMocks();
    gameWon.set(false);
    scoreboardOpen.set(false);
  });

  it('is not offered during play', async () => {
    await renderComponent();

    expect(screen.queryByRole('button', {name: 'Show scores'})).toBeNull();
  });

  it('is not offered while the scoreboard is open', async () => {
    gameWon.set(true);
    scoreboardOpen.set(true);

    await renderComponent();

    expect(screen.queryByRole('button', {name: 'Show scores'})).toBeNull();
  });

  it('opens the scoreboard again when the game is won and the scoreboard is closed', async () => {
    gameWon.set(true);

    await renderComponent();
    fireEvent.click(screen.getByRole('button', {name: 'Show scores'}));

    expect(openScoreboard).toHaveBeenCalledTimes(1);
  });
});
