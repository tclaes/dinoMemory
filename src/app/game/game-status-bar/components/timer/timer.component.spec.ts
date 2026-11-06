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
        {provide: TimerService, useValue: {elapsedMs: signal(0)}}
      ]
    });
  })

  it('shows the elapsed time as a clock and updates it', async () => {
    const elapsedMs = signal(0);

    const {fixture} = await render(TimerComponent, {
      providers: [
        {provide: TimerService, useValue: {elapsedMs}}
      ]
    });

    expect(screen.getByText('00:00')).toBeTruthy();

    elapsedMs.set(1000);
    fixture.detectChanges();

    await waitFor(() => {
      expect(screen.getByText('00:01')).toBeTruthy();
    });
    expect(screen.queryByText('00:00')).toBeNull();
  })
})
