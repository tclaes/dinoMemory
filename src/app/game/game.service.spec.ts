import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';
import { of } from 'rxjs';

import { GameService } from './game.service';
import { DeckService } from '../shared/deck.service';
import { ScoreService } from './scoreboard/score.service';
import { LocalstorageService } from '../shared/localstorage.service';
import { TimerService } from './timer/timer.service';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../auth.service';
import { mockUser } from '../../testing/firebase-mocks';

function createFakeCard(identifier: string): any {
  const classes = new Set<string>();
  return {
    classList: { contains: (c: string) => classes.has(c) },
    getAttribute: (name: string) => (name === 'identifier' ? identifier : null)
  };
}

describe('GameService', () => {
  let service: GameService;
  let sharedSrv: SharedService;
  let timerSrv: TimerService;
  let deckSrvSpy: jasmine.SpyObj<DeckService>;
  let scoreSrvSpy: jasmine.SpyObj<ScoreService>;
  let renderer2Spy: jasmine.SpyObj<Renderer2>;

  beforeEach(() => {
    deckSrvSpy = jasmine.createSpyObj('DeckService', ['setDeckObservable']);
    scoreSrvSpy = jasmine.createSpyObj('ScoreService', ['updateScores']);
    const localSpy = jasmine.createSpyObj('LocalstorageService', ['getUser', 'setUser', 'deleteUser']);

    TestBed.configureTestingModule({
      providers: [
        GameService,
        SharedService,
        TimerService,
        { provide: DeckService, useValue: deckSrvSpy },
        { provide: ScoreService, useValue: scoreSrvSpy },
        { provide: LocalstorageService, useValue: localSpy },
        { provide: AuthService, useValue: { User: of(mockUser) } }
      ]
    });

    service = TestBed.get(GameService);
    sharedSrv = TestBed.get(SharedService);
    timerSrv = TestBed.get(TimerService);

    renderer2Spy = jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass', 'setStyle']);
    // renderer2 is assigned by GameComponent at runtime, not injected via DI.
    service.renderer2 = renderer2Spy;

    sharedSrv.setDeck({ name: 'dinos', cards: ['a', 'b'] } as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('newGame() resets game state, the click counter and the timer', () => {
    sharedSrv.cardClicked(9);
    service.gameStarted = true;
    service.gameWon = true;
    service.correctMatch = 3;

    service.newGame();

    expect(service.gameStarted).toBe(false);
    expect(service.gameWon).toBe(false);
    expect(service.correctMatch).toBe(0);

    let clicks: number;
    sharedSrv.currentTimesClicked.subscribe(c => (clicks = c));
    expect(clicks).toBe(0);

    let time: string;
    timerSrv.currentTime.subscribe(t => (time = t));
    expect(time).toBe('0h - 0m - 0s');
  });

  it('the first flip of a game starts the timer and records the first card', fakeAsync(() => {
    const card1 = createFakeCard('a');

    service.flipCard({ currentTarget: card1 });

    expect(service.gameStarted).toBe(true);
    expect(renderer2Spy.addClass).toHaveBeenCalledWith(card1, 'flip');
    expect(service.hasFlippedCard).toBe(true);
    expect(service.firstCard).toBe(card1);

    discardPeriodicTasks();
  }));

  it('clicking the same card twice is a no-op', fakeAsync(() => {
    const card1 = createFakeCard('a');
    service.flipCard({ currentTarget: card1 });
    renderer2Spy.addClass.calls.reset();

    service.flipCard({ currentTarget: card1 });

    expect(renderer2Spy.addClass).not.toHaveBeenCalled();
    expect(service.secondCard).toBeUndefined();

    discardPeriodicTasks();
  }));

  it('unflips both cards after a delay when they do not match', fakeAsync(() => {
    const card1 = createFakeCard('a');
    const card2 = createFakeCard('b');

    service.flipCard({ currentTarget: card1 });
    service.flipCard({ currentTarget: card2 });

    tick(1000);

    expect(renderer2Spy.removeClass).toHaveBeenCalledWith(card1, 'flip');
    expect(renderer2Spy.removeClass).toHaveBeenCalledWith(card2, 'flip');
    expect(service.hasFlippedCard).toBe(false);
    expect(service.firstCard).toBeNull();

    discardPeriodicTasks();
  }));

  it('a full match reports the score with the elapsed time and click count', fakeAsync(() => {
    sharedSrv.setDeck({ name: 'dinos', cards: ['a'] } as any);
    sharedSrv.cardClicked(4);

    const card1 = createFakeCard('a');
    const card2 = createFakeCard('a');

    service.flipCard({ currentTarget: card1 });
    tick(3000);
    service.flipCard({ currentTarget: card2 });

    expect(scoreSrvSpy.updateScores).toHaveBeenCalledWith(mockUser.displayName, 4, '0h - 0m - 3s', 'dinos');
    expect(service.correctMatch).toBe(1);

    discardPeriodicTasks();
  }));

  it('shuffle() removes the flip class and sets a deterministic order style', () => {
    spyOn(Math, 'random').and.returnValue(0.5);
    const card = { nativeElement: {} };

    service.shuffle(card);

    expect(renderer2Spy.removeClass).toHaveBeenCalledWith(card.nativeElement, 'flip');
    expect(renderer2Spy.setStyle).toHaveBeenCalledWith(card.nativeElement, 'order', '6');
  });
});
