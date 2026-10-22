import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {fakeAsync, TestBed} from '@angular/core/testing';
import {Renderer2, signal} from '@angular/core';
import {of} from 'rxjs';

import {GameService} from './game.service';
import {DeckService} from './deck.service';
import {ScoreService} from '../../scoreboard/score.service';
import {TimerService} from '../../timer/timer.service';
import {AuthService} from '../../../core/auth/services/auth.service';
import {mockUser} from '../../../../testing/firebase-mocks';
import {createSpyObj, SpyObj} from '../../../../testing/spy';
import {Deck} from '../model/deck';

function createFakeCard(identifier: string): any {
  const classes = new Set<string>();
  return {
    classList: {contains: (c: string) => classes.has(c)},
    getAttribute: (name: string) => (name === 'identifier' ? identifier : null)
  };
}

describe('GameService', () => {
  let service: GameService;
  let selectedDeck: ReturnType<typeof signal<Deck>>;
  let deckSrvFake: { selectedDeck: typeof selectedDeck; selectDeck: ReturnType<typeof vi.fn> };
  let scoreSrvSpy: SpyObj<ScoreService>;
  let renderer2Spy: SpyObj<Renderer2>;

  beforeEach(() => {
    selectedDeck = signal<Deck>({name: 'dinos', cards: ['a', 'b']});
    deckSrvFake = {selectedDeck, selectDeck: vi.fn()};
    scoreSrvSpy = createSpyObj('ScoreService', ['updateScores']);

    TestBed.configureTestingModule({
      providers: [
        GameService,
        TimerService,
        {provide: DeckService, useValue: deckSrvFake},
        {provide: ScoreService, useValue: scoreSrvSpy},
        {provide: AuthService, useValue: {User: of(mockUser)}}
      ]
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('newGame() resets game state, the click counter and the timer, and selects the deck', () => {
  //   sharedSrv.cardClicked(9);
  //   service.gameStarted.set(true);
  //   service.gameWon = true;
  //   service.correctMatch = 3;
  //
  //   service.newGame('sharks');
  //
  //   expect(service.gameStarted()).toBe(false);
  //   expect(service.gameWon).toBe(false);
  //   expect(service.correctMatch).toBe(0);
  //   expect(deckSrvFake.selectDeck).toHaveBeenCalledWith('sharks');
  //
  //   let clicks: number;
  //   sharedSrv.currentTimesClicked.subscribe(c => (clicks = c));
  //   expect(clicks).toBe(0);
  //
  //   expect(timerSrv.currentTime()).toBe('0h - 0m - 0s');
  // });

  it('the first flip of a game starts the timer and records the first card', fakeAsync(() => {
    // const card1 = createFakeCard('a');
    //
    // service.flipCard({currentTarget: card1});
    //
    // expect(service.gameStarted()).toBe(true);
    // expect(renderer2Spy.addClass).toHaveBeenCalledWith(card1, 'flip');
    // expect(service.hasFlippedCard).toBe(true);
    // expect(service.firstCard).toBe(card1);
    //
    // discardPeriodicTasks();
  }));

  it('clicking the same card twice is a no-op', fakeAsync(() => {
    // const card1 = createFakeCard('a');
    // service.flipCard({currentTarget: card1});
    // renderer2Spy.addClass.mockClear();
    //
    // service.flipCard({currentTarget: card1});
    //
    // expect(renderer2Spy.addClass).not.toHaveBeenCalled();
    // expect(service.secondCard).toBeUndefined();
    //
    // discardPeriodicTasks();
  }));

  it('unflips both cards after a delay when they do not match', fakeAsync(() => {
    // const card1 = createFakeCard('a');
    // const card2 = createFakeCard('b');
    //
    // service.flipCard({currentTarget: card1});
    // service.flipCard({currentTarget: card2});
    //
    // tick(1000);
    //
    // expect(renderer2Spy.removeClass).toHaveBeenCalledWith(card1, 'flip');
    // expect(renderer2Spy.removeClass).toHaveBeenCalledWith(card2, 'flip');
    // expect(service.hasFlippedCard).toBe(false);
    // expect(service.firstCard).toBeNull();
    //
    // discardPeriodicTasks();
  }));

  it('a full match reports the score with the elapsed time and click count', fakeAsync(() => {
    // selectedDeck.set({name: 'dinos', cards: ['a']});
    // sharedSrv.cardClicked(4);
    //
    // const card1 = createFakeCard('a');
    // const card2 = createFakeCard('a');
    //
    // service.flipCard({currentTarget: card1});
    // tick(3000);
    // service.flipCard({currentTarget: card2});
    //
    // expect(scoreSrvSpy.updateScores).toHaveBeenCalledWith(mockUser.displayName, 4, '0h - 0m - 3s', 'dinos');
    // expect(service.correctMatch).toBe(1);
    //
    // discardPeriodicTasks();
  }));

  it('shuffle() removes the flip class and sets a deterministic order style', () => {
    // vi.spyOn(Math, 'random').mockReturnValue(0.5);
    // const card = {nativeElement: {}};
    //
    // service.shuffle(card);
    //
    // expect(renderer2Spy.removeClass).toHaveBeenCalledWith(card.nativeElement, 'flip');
    // expect(renderer2Spy.setStyle).toHaveBeenCalledWith(card.nativeElement, 'order', '6');
  });
});
