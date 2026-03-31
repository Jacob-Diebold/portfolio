/** Empty board filled with 0. */
export function createEmptyBoard(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
}

/** Board filled with a single value. */
export function createFilledBoard(rows: number, cols: number, value: 0 | 1): number[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => value));
}

/** Random 0/1 board. */
export function createRandomBoard(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() > 0.5 ? 1 : 0) as number),
  );
}
