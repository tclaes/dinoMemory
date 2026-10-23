import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/angular';
import {RestartComponent} from './restart.component';
import {GlobalService} from '../../../global/services/global.service';

describe('RestartComponent', () => {
  it('should create', () => {
    render(RestartComponent)
  })

  it('should stop the game', async () => {
    const stopGame = vi.fn()
    await render(RestartComponent, {
      providers: [
        { provide: GlobalService, useValue: {
          stopGame
          }}
      ]
    })

    screen.getByRole('button', { name: /restart/i }).click()

    expect(stopGame).toHaveBeenCalled()
  })
})
