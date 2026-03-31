export type WipeCursor = {
  cellIndex: number;
  pass: 0 | 1;
};

/** Row-major: each row; column-major: each column. */
export type WipeOrder = "rows" | "columns";

/** Linear: same direction each line; snake: alternate direction (boustrophedon). */
export type WipePath = "linear" | "snake";

/** Own clock for wipe (ms between successive cells). Not tied to random/scroll tick UI. */
export const WIPE_MS_PER_STEP = 10;

function wipeCellFromIndex(
  cellIndex: number,
  rows: number,
  cols: number,
  order: WipeOrder,
  path: WipePath,
): { row: number; col: number } {
  if (path === "linear") {
    if (order === "rows") {
      return { row: Math.floor(cellIndex / cols), col: cellIndex % cols };
    }
    return { row: cellIndex % rows, col: Math.floor(cellIndex / rows) };
  }

  if (order === "rows") {
    const row = Math.floor(cellIndex / cols);
    const offset = cellIndex % cols;
    const col = row % 2 === 0 ? offset : cols - 1 - offset;
    return { row, col };
  }

  const col = Math.floor(cellIndex / rows);
  const offset = cellIndex % rows;
  const row = col % 2 === 0 ? offset : rows - 1 - offset;
  return { row, col };
}

/**
 * One wipe step: paint one cell; traversal uses `order` (rows vs columns) and `path` (linear vs snake).
 * After `rows * cols` paints, flip `pass` and start again.
 */
export function stepWipe(
  board: number[][],
  rows: number,
  cols: number,
  cursor: WipeCursor,
  order: WipeOrder,
  path: WipePath,
): { nextBoard: number[][]; nextCursor: WipeCursor } {
  let { cellIndex, pass } = cursor;
  if (cellIndex >= rows * cols) {
    cellIndex = 0;
    pass = pass === 0 ? 1 : 0;
  }

  const { row, col } = wipeCellFromIndex(cellIndex, rows, cols, order, path);
  const nextBoard = board.map((r) => r.slice());
  if (row >= 0 && row < rows && col >= 0 && col < cols) {
    nextBoard[row][col] = pass;
  }

  return {
    nextBoard,
    nextCursor: { cellIndex: cellIndex + 1, pass },
  };
}
