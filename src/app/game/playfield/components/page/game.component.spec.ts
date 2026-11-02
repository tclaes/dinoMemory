import {describe, expect, it} from 'vitest';
import {GameComponent} from './game.component';
import {render} from '@testing-library/angular';
import {DeckService} from '../../services/deck.service';
import {Component, signal} from '@angular/core';
import {GameStatusBarComponent} from '../../../game-status-bar/components/game-status-bar/game-status-bar.component';
import {GameService} from '../../services/game.service';
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

  const renderGame = () => render(GameComponent, {
    providers: [
      {provide: DeckService, useValue: {selectedDeck: signal({name: 'dinos'})}},
      {provide: GameService, useValue: {gameWon}}
    ],
    importOverrides: [
      {replace: GameStatusBarComponent, with: ScoreStubComponent},
      {replace: DeckComponent, with: DeckStubComponent},
      {replace: ScoreboardComponent, with: ScoreboardStubComponent}
    ]
  });

  it('should expose the selected deck', async () => {
    const {fixture} = await renderGame();

    expect(fixture.componentInstance.deck()).toEqual({name: 'dinos'});
  })
  it('shows the scoreboard only when the game is won', async () => {
    gameWon.set(false);
    const {fixture, container} = await renderGame();
    expect(container.querySelector('app-scoreboard')).toBeNull();

    gameWon.set(true);
    fixture.detectChanges();
    expect(container.querySelector('app-scoreboard')).toBeTruthy();
  });
});
