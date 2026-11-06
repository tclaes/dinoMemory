import {describe, expect, it} from 'vitest';
import {Component} from '@angular/core';
import {render, screen} from '@testing-library/angular';
import {DurationPipe} from './duration.pipe';

@Component({
  imports: [DurationPipe],
  template: `<span>{{ 65300 | duration }}</span>`,
})
class HostComponent {}

describe('DurationPipe', () => {
  it('transforms milliseconds into a clock', () => {
    expect(new DurationPipe().transform(65300)).toBe('01:05');
  });

  it('renders in a template', async () => {
    await render(HostComponent);

    expect(screen.getByText('01:05')).toBeTruthy();
  });
});
