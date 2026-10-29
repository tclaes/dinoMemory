import {TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {signal} from '@angular/core';
import {of} from 'rxjs';
import {GameService} from './game.service';
import {AuthService} from '../../../core/auth/services/auth.service';
import {DeckService} from './deck.service';

describe('Game Service', () => {
  let service: GameService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: {User: of(null)}},
        {provide: DeckService, useValue: {selectedDeck: signal({name: 'test', cards: ['rex', 'trike']})}}
      ]
    });
    service = TestBed.inject(GameService);
  });

  afterEach(() => vi.useRealTimers());

  it('builds a board with two cards per deck entry', () => {
    expect(service.board().map(c => c.id).sort())
      .toEqual(['rex-a', 'rex-b', 'trike-a', 'trike-b']);
  });

  it('keeps a matching pair face up', () => {
    service.flipCard('rex-a');
    service.flipCard('rex-b');

    expect(service.matchedIds()).toEqual(new Set(['rex-a', 'rex-b']));
    expect(service.flippedIds()).toEqual([]);
  });

  it('unflips a mismatch after 1s and blocks flips meanwhile', () => {
    service.flipCard('rex-a');
    service.flipCard('trike-a');
    service.flipCard('rex-b');

    expect(service.flippedIds()).toEqual(['rex-a', 'trike-a']);

    vi.advanceTimersByTime(1000);

    expect(service.flippedIds()).toEqual([]);
    expect(service.matchedIds().size).toBe(0);
  });

  it('ignores flipping a card that is already face up', () => {
    service.flipCard('rex-a');
    service.flipCard('rex-a');

    expect(service.flippedIds()).toEqual(['rex-a']);
  });

  it('should show a game won message when all pairs are found', () => {
    service.flipCard('rex-a');
    service.flipCard('rex-b');
    service.flipCard('trike-a');
    service.flipCard('trike-b');

    expect(service.gameWon()).toBeTruthy()
  })
});
