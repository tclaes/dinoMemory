import {TestBed} from '@angular/core/testing';
import {BehaviorSubject, of} from 'rxjs';
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
  const scoreboardOpen = signal(true);
  const closeScoreboard = vi.fn(() => scoreboardOpen.set(false));

  function setup() {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GameService,
          useValue: {
            user, deck: signal({name: 'dinos'}), scoreSaved, markScoreSaved, scoreboardOpen, closeScoreboard
          }
        },
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

  const dialogOf = (fixture: { nativeElement: HTMLElement }) =>
    fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;

  beforeEach(() => {
    vi.clearAllMocks();
    user.set({displayName: 'Rex'});
    scoreSaved.set(false);
    scoreboardOpen.set(true);
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

  describe('dialog', () => {
    it('opens as a modal dialog named by its heading', () => {
      const dialog = dialogOf(setup());

      expect(dialog.open).toBe(true);
      expect(dialog.getAttribute('aria-labelledby')).toBe('scoreboard-title');
      expect(dialog.querySelector('#scoreboard-title').textContent).toBeTruthy();
    });

    it('stays closed while the scoreboard is not open', () => {
      scoreboardOpen.set(false);

      expect(dialogOf(setup()).open).toBe(false);
    });

    it('opens again and closes when the open state changes', () => {
      scoreboardOpen.set(false);
      const fixture = setup();

      scoreboardOpen.set(true);
      fixture.detectChanges();
      expect(dialogOf(fixture).open).toBe(true);

      scoreboardOpen.set(false);
      fixture.detectChanges();
      expect(dialogOf(fixture).open).toBe(false);
    });

    it('closes with the close button and reports it', () => {
      const fixture = setup();

      fixture.nativeElement.querySelector('.scoreboard-close').click();

      expect(dialogOf(fixture).open).toBe(false);
      expect(closeScoreboard).toHaveBeenCalledTimes(1);
    });

    it('reports a close by Escape or light dismiss', () => {
      const fixture = setup();

      dialogOf(fixture).close();

      expect(closeScoreboard).toHaveBeenCalledTimes(1);
    });

    it('does not save the score again when closed and reopened', () => {
      const fixture = setup();

      dialogOf(fixture).close();
      scoreboardOpen.set(true);
      fixture.detectChanges();

      expect(dialogOf(fixture).open).toBe(true);
      expect(scoreService.updateScores).toHaveBeenCalledTimes(1);
    });

    describe('light dismiss fallback', () => {
      const press = (dialog: HTMLDialogElement, type: string, x: number, y: number) =>
        dialog.dispatchEvent(new MouseEvent(type, {clientX: x, clientY: y, bubbles: true}));

      function setupWithBox() {
        const fixture = setup();
        const dialog = dialogOf(fixture);
        dialog.getBoundingClientRect = () => ({left: 100, right: 300, top: 100, bottom: 300}) as DOMRect;
        return {fixture, dialog};
      }

      it('closes when the press and the release are outside the dialog', () => {
        const {dialog} = setupWithBox();

        press(dialog, 'pointerdown', 10, 10);
        press(dialog, 'pointerup', 10, 10);

        expect(dialog.open).toBe(false);
      });

      it('stays open when the click is on the dialog content or padding', () => {
        const {dialog} = setupWithBox();

        press(dialog, 'pointerdown', 150, 150);
        press(dialog, 'pointerup', 150, 150);

        expect(dialog.open).toBe(true);
      });

      it('stays open when a drag starts inside and ends outside', () => {
        const {dialog} = setupWithBox();

        press(dialog, 'pointerdown', 150, 150);
        press(dialog, 'pointerup', 10, 10);

        expect(dialog.open).toBe(true);
      });
    });
  });

  describe('own result', () => {
    const listed = (...rows: Array<[string, number, number]>) =>
      of(rows.map(([name, clicks, durationMs]) => ({user: name, deck: 'dinos', clicks, durationMs})));
    const titleOf = (fixture: { nativeElement: HTMLElement }) =>
      fixture.nativeElement.querySelector('#scoreboard-title').textContent.trim();
    const mineRows = (fixture: { nativeElement: HTMLElement }) =>
      Array.from(fixture.nativeElement.querySelectorAll('tr.mine')) as HTMLElement[];

    it('shows the rank and highlights the own row when the score is in the top 10', () => {
      scoreService.loadScores.mockReturnValue(listed(['Ann', 6, 20000], ['Rex', 8, 30500], ['Bob', 9, 25000]));

      const fixture = setup();

      expect(titleOf(fixture)).toBe("You're #2");
      expect(mineRows(fixture)).toHaveLength(1);
      expect(mineRows(fixture)[0].textContent).toContain('Rex');
      expect(mineRows(fixture)[0].getAttribute('aria-current')).toBe('true');
    });

    it('shows "Game won" without a highlight when the score is not in the top 10', () => {
      scoreService.loadScores.mockReturnValue(listed(['Ann', 6, 20000], ['Bob', 7, 25000]));

      const fixture = setup();

      expect(titleOf(fixture)).toBe('Game won');
      expect(mineRows(fixture)).toHaveLength(0);
      expect(fixture.nativeElement.textContent).toContain('8 tries');
    });

    it('does not mistake another player with the same score for the own row', () => {
      scoreService.loadScores.mockReturnValue(listed(['Zed', 8, 30500]));

      expect(titleOf(setup())).toBe('Game won');
    });

    it('shows "Game won" without a highlight when no user is signed in', () => {
      user.set(null);
      scoreService.loadScores.mockReturnValue(listed(['Rex', 8, 30500]));

      const fixture = setup();

      expect(titleOf(fixture)).toBe('Game won');
      expect(mineRows(fixture)).toHaveLength(0);
    });

    it('highlights only the first of identical scores', () => {
      scoreService.loadScores.mockReturnValue(listed(['Rex', 8, 30500], ['Rex', 8, 30500]));

      const fixture = setup();

      expect(titleOf(fixture)).toBe("You're #1");
      expect(mineRows(fixture)).toHaveLength(1);
    });

    it('keeps the rank when better scores arrive while the scoreboard is closed', () => {
      const live = new BehaviorSubject([
        {user: 'Ann', deck: 'dinos', clicks: 6, durationMs: 20000},
        {user: 'Rex', deck: 'dinos', clicks: 8, durationMs: 30500}
      ]);
      scoreService.loadScores.mockReturnValue(live);
      const fixture = setup();
      expect(titleOf(fixture)).toBe("You're #2");

      dialogOf(fixture).close();
      live.next([
        {user: 'Zed', deck: 'dinos', clicks: 5, durationMs: 10000},
        {user: 'Ann', deck: 'dinos', clicks: 6, durationMs: 20000},
        {user: 'Rex', deck: 'dinos', clicks: 8, durationMs: 30500}
      ]);
      scoreboardOpen.set(true);
      fixture.detectChanges();

      expect(titleOf(fixture)).toBe("You're #2");
      expect(mineRows(fixture)[0].textContent).toContain('Rex');
    });

    it('keeps the rank when the scoreboard is closed and reopened', () => {
      scoreService.loadScores.mockReturnValue(listed(['Ann', 6, 20000], ['Rex', 8, 30500]));
      const fixture = setup();

      dialogOf(fixture).close();
      scoreboardOpen.set(true);
      fixture.detectChanges();

      expect(titleOf(fixture)).toBe("You're #2");
      expect(mineRows(fixture)).toHaveLength(1);
    });
  });
});
