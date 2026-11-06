import {describe, expect, it} from 'vitest';
import {formatDuration} from './format-duration';

describe('formatDuration', () => {
  it.each([
    [0, '00:00'],
    [5000, '00:05'],
    [9870, '00:09'],
    [65000, '01:05'],
    [3599999, '59:59'],
    [3600000, '1:00:00'],
    [3723000, '1:02:03'],
  ])('formats %d ms as %s', (ms, expected) => {
    expect(formatDuration(ms)).toBe(expected);
  });
});
