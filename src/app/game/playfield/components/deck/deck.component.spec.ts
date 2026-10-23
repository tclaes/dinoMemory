import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/angular';
import {DeckComponent} from './deck.component';
import {GameService} from '../../services/game.service';
import {signal} from '@angular/core';

const gameService = {
  board: signal([{id: '1', name: 'rex', coverIndex: 0}]),
  deck: signal({}),
  faceUpIds: signal(new Set()),
  matchedIds: signal(new Set()),
  flipCard: vi.fn()
};

describe('Deck',  () => {
  it('should create', async () => {
    const view = await render(DeckComponent, {
      providers: [
        {provide: GameService, useValue: gameService}
      ]
    })

    expect(view.fixture.componentInstance).toBeTruthy();
  })

  it('should flip card on click', async () => {
    await render(DeckComponent, {
      providers: [
        {provide: GameService, useValue: gameService}
      ]
    })

    fireEvent.click(screen.getByRole('button', {name: /flip card/i}));

    expect(gameService.flipCard).toHaveBeenCalledWith('1');
  })

  it('should have class flip when card is faced up', async () => {
    await render(DeckComponent, {
      providers: [
        {provide: GameService, useValue: {...gameService, faceUpIds: signal(new Set('1'))}}
      ]
    })


    const clicked = screen.getByRole('button', {name: /flip card/i})
    clicked.click()

    // the flip class is bound on the <app-card> host, not on the clicked back-face
    expect(clicked.closest('app-card').classList.contains('flip')).toBe(true)
  })

  it('should have class matched when a pair is matched', async () => {
    await render(DeckComponent, {
      providers: [
        {provide: GameService, useValue: {...gameService,
            faceUpIds: signal(new Set(['1', '2'])),
            matchedIds: signal(new Set(['1', '2']))
        }
        }
      ]
    })


    const clicked = screen.getByRole('button', {name: /flip card/i})
    clicked.click()

    // the flip class is bound on the <app-card> host, not on the clicked back-face
    expect(clicked.closest('app-card').classList.contains('matched')).toBe(true)
  })
})
