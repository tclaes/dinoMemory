export interface Grid {
  columns: number;
  rows: number;
  cardSize: number;
}

/** Picks the column count that gives the largest square cards that fit `count` cards in `width` x `height`. */
export function bestGrid(count: number, width: number, height: number, gap: number): Grid {
  let best: Grid = {columns: 1, rows: Math.max(count, 1), cardSize: 0};

  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns);
    const cardSize = Math.min(
      (width - (columns - 1) * gap) / columns,
      (height - (rows - 1) * gap) / rows
    );

    if (cardSize > best.cardSize) {
      best = {columns, rows, cardSize};
    }
  }

  return best;
}
