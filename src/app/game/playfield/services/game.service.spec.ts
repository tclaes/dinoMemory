import {TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {signal} from '@angular/core';
import {of} from 'rxjs';
import {GameService} from './game.service';
import {AuthService} from '../../../core/auth/services/auth.service';
import {DeckService} from './deck.service';

const pairs = (count: number, phase = 1) => Array.from({length: count}, (_, i) => ({
  key: `k${phase}-${i}`, letter: `l${phase}-${i}`, word: `w${phase}-${i}`, emoji: '*', phase
}));

describe('Game Service with paired deck', () => {
  function setup(deck: object) {
    TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: {User: of(null)}},
        {provide: DeckService, useValue: {selectedDeck: signal({name: 'abc', ...deck})}}
      ]
    });
    return TestBed.inject(GameService);
  }

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('builds one letter card and one word card per pair', () => {
    const service = setup({pairs: pairs(3)});

    const board = service.board();
    expect(board).toHaveLength(6);
    expect(board.filter(c => c.face.kind === 'letter')).toHaveLength(3);
    expect(board.filter(c => c.face.kind === 'word')).toHaveLength(3);
  });

  it('limits the board to pairsPerGame distinct pairs', () => {
    const service = setup({pairs: pairs(12), pairsPerGame: 8});

    const board = service.board();
    expect(board).toHaveLength(16);
    expect(new Set(board.map(c => c.pairKey)).size).toBe(8);
    expect(new Set(board.map(c => c.id)).size).toBe(16);
  });

  it('only uses pairs up to maxPhase', () => {
    const service = setup({pairs: [...pairs(3, 1), ...pairs(3, 2)], maxPhase: 1});

    expect(service.board().every(c => c.pairKey.startsWith('k1-'))).toBe(true);
    expect(service.board()).toHaveLength(6);
  });

  it('uses all pairs when no maxPhase is set', () => {
    const service = setup({pairs: [...pairs(3, 1), ...pairs(3, 2)]});

    expect(service.board()).toHaveLength(12);
  });

  it('matches a letter with its word', () => {
    const service = setup({pairs: pairs(2)});

    service.flipCard('k1-0-letter');
    service.flipCard('k1-0-word');

    expect(service.matchedIds()).toEqual(new Set(['k1-0-letter', 'k1-0-word']));
  });

  it('does not match a letter with another pair\'s word', () => {
    const service = setup({pairs: pairs(2)});

    service.flipCard('k1-0-letter');
    service.flipCard('k1-1-word');
    vi.advanceTimersByTime(1000);

    expect(service.matchedIds().size).toBe(0);
    expect(service.flippedIds()).toEqual([]);
  });

  it('does not match two letter cards', () => {
    const service = setup({pairs: pairs(2)});

    service.flipCard('k1-0-letter');
    service.flipCard('k1-1-letter');
    vi.advanceTimersByTime(1000);

    expect(service.matchedIds().size).toBe(0);
  });

  it('keeps the same board while the game is running', () => {
    const service = setup({pairs: pairs(12), pairsPerGame: 4});
    const first = service.board();

    service.flipCard(first[0].id);

    expect(service.board()).toBe(first);
  });
});

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

  it('is not won while the board is empty', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: {User: of(null)}},
        {provide: DeckService, useValue: {selectedDeck: signal(undefined)}}
      ]
    });
    const empty = TestBed.inject(GameService);

    expect(empty.board()).toHaveLength(0);
    expect(empty.gameWon()).toBe(false);
  });
});
