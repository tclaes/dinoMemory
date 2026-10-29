import {describe, expect, it} from 'vitest';
import {bestGrid} from './best-grid';

describe('bestGrid', () => {
  it('uses more columns when the deck is wide and short', () => {
    const grid = bestGrid(20, 1600, 400, 16);

    expect(grid.columns).toBeGreaterThan(5);
    expect(grid.cardSize).toBeGreaterThan(0);
  });

  it('uses fewer columns when the deck is narrow and tall', () => {
    const grid = bestGrid(20, 400, 1200, 8);

    expect(grid.columns).toBeLessThan(5);
  });

  it('never lets the cards overflow the deck', () => {
    const {columns, rows, cardSize} = bestGrid(18, 900, 500, 12);

    expect(columns * cardSize + (columns - 1) * 12).toBeLessThanOrEqual(900);
    expect(rows * cardSize + (rows - 1) * 12).toBeLessThanOrEqual(500);
  });

  it('handles an empty board', () => {
    expect(bestGrid(0, 900, 500, 12).cardSize).toBe(0);
  });
});
