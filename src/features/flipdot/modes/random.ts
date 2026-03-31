/** Apply `count` random cell writes (0 or 1). Returns a new board. */
export function applyRandomDots(board: number[][], count: number): number[][] {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return board;
  const next = board.map((r) => r.slice());
  for (let k = 0; k < count; k++) {
    const i = Math.floor(Math.random() * rows);
    const j = Math.floor(Math.random() * cols);
    next[i][j] = Math.random() > 0.5 ? 1 : 0;
  }
  return next;
}
