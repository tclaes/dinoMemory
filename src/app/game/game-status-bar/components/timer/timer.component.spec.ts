import {describe, expect, it} from 'vitest';
import {TimerComponent} from './timer.component';
import {render, screen} from '@testing-library/angular';
import {TimerService} from '../../services/timer.service';
import {signal} from '@angular/core';
import {waitFor} from '@testing-library/dom';

describe('TimerComponent', () => {
  it('should create', async () => {
    await render(TimerComponent, {
      providers: [
        {provide: TimerService, useValue: {currentTime: signal(0)}}
      ]
    });
  })

  it('should update the current time', async () => {
    const currentTime = signal('0h - 0m - 0s');

    const {fixture} = await render(TimerComponent, {
      providers: [
        {provide: TimerService, useValue: {currentTime}}
      ]
    });

    expect(screen.getByText('0h - 0m - 0s')).toBeTruthy();

    currentTime.set('0h - 0m - 1s');
    fixture.detectChanges();

    await waitFor(() => {
      expect(screen.getByText('0h - 0m - 1s')).toBeTruthy();
    });
    expect(screen.queryByText('0h - 0m - 0s')).toBeNull();
  })
})
