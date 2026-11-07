import {describe, expect, it, vi} from 'vitest';
import {GameComponent} from './game.component';
import {render} from '@testing-library/angular';
import {DeckService} from '../../services/deck.service';
import {Component, signal} from '@angular/core';
import {Router} from '@angular/router';
import {GameStatusBarComponent} from '../../../game-status-bar/components/game-status-bar/game-status-bar.component';
import {GameService} from '../../services/game.service';
import {GlobalService} from '../../../global/services/global.service';
import {ScoreboardComponent} from '../../../scoreboard/scoreboard.component';
import {DeckComponent} from '../deck/deck.component';

@Component({selector: 'app-game-status-bar', template: ''})
class ScoreStubComponent {}

@Component({selector: 'app-deck', template: ''})
class DeckStubComponent {}

@Component({selector: 'app-scoreboard', template: ''})
class ScoreboardStubComponent {}

describe('Game Component', () => {
  const gameWon = signal(false);

  const renderGame = async (
    options: {deck?: string, availableDecks?: {name: string}[] | undefined} = {}
  ) => {
    const {deck} = options;
    // `undefined` decks means "still loading", so only default when the key is absent.
    const availableDecks = 'availableDecks' in options ? options.availableDecks : [{name: 'dinos'}, {name: 'alfabet'}];
    const deckService = {
      selectedDeck: signal({name: 'dinos'}),
      availableDecks: signal(availableDecks),
      selectDeck: vi.fn(),
    };
    const globalService = {stopGame: vi.fn()};
    const router = {navigate: vi.fn()};
    const result = await render(GameComponent, {
      inputs: deck === undefined ? {} : {deck},
      providers: [
        {provide: DeckService, useValue: deckService},
        {provide: GameService, useValue: {gameWon}},
        {provide: GlobalService, useValue: globalService},
        {provide: Router, useValue: router},
      ],
      importOverrides: [
        {replace: GameStatusBarComponent, with: ScoreStubComponent},
        {replace: DeckComponent, with: DeckStubComponent},
        {replace: ScoreboardComponent, with: ScoreboardStubComponent}
      ]
    });
    return {...result, deckService, globalService, router};
  };

  it('should expose the selected deck', async () => {
    const {fixture} = await renderGame();

    expect(fixture.componentInstance.selectedDeck()).toEqual({name: 'dinos'});
  });

  it('selects the default deck when no deck is in the address', async () => {
    const {deckService} = await renderGame();

    expect(deckService.selectDeck).toHaveBeenCalledWith('dinos');
  });

  it('selects the deck from the address and starts a new game', async () => {
    const {deckService, globalService} = await renderGame({deck: 'alfabet'});

    expect(deckService.selectDeck).toHaveBeenCalledWith('alfabet');
    expect(globalService.stopGame).toHaveBeenCalled();
  });

  it('stops the game and switches deck when the address changes', async () => {
    const {deckService, globalService, fixture} = await renderGame({deck: 'alfabet'});
    globalService.stopGame.mockClear();

    fixture.componentRef.setInput('deck', 'dinos');
    fixture.detectChanges();

    expect(globalService.stopGame).toHaveBeenCalled();
    expect(deckService.selectDeck).toHaveBeenLastCalledWith('dinos');
  });

  it('sends an unknown deck to the start page', async () => {
    const {router} = await renderGame({deck: 'unknown'});

    expect(router.navigate).toHaveBeenCalledWith(['/'], {replaceUrl: true});
  });

  it('does not redirect while the decks are still loading', async () => {
    const {router} = await renderGame({deck: 'unknown', availableDecks: undefined});

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('does not redirect a known deck', async () => {
    const {router} = await renderGame({deck: 'alfabet'});

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('shows the scoreboard only when the game is won', async () => {
    gameWon.set(false);
    const {fixture, container} = await renderGame();
    expect(container.querySelector('app-scoreboard')).toBeNull();

    gameWon.set(true);
    fixture.detectChanges();
    expect(container.querySelector('app-scoreboard')).toBeTruthy();
  });
});
