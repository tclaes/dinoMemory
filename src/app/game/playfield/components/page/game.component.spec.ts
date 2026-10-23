import {describe, expect, it} from 'vitest';
import {GameComponent} from './game.component';
import {render} from '@testing-library/angular';
import {DeckService} from '../../services/deck.service';
import {Component, signal} from '@angular/core';
import {ScoreComponent} from '../../../score/score.component';
import {DeckComponent} from '../deck/deck.component';

@Component({selector: 'app-score', template: ''})
class ScoreStubComponent {}

@Component({selector: 'app-deck', template: ''})
class DeckStubComponent {}

describe('Game Component', () => {
  it('should expose the selected deck', async () => {
    const {fixture} = await render(GameComponent, {
      providers: [
        {provide: DeckService, useValue: {selectedDeck: signal({name: 'dinos'})}}
      ],
      importOverrides: [
        {replace: ScoreComponent, with: ScoreStubComponent},
        {replace: DeckComponent, with: DeckStubComponent}
      ]
    });

    expect(fixture.componentInstance.deck()).toEqual({name: 'dinos'});
  })
})
