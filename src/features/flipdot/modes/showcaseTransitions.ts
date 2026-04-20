import type { WipeOrder, WipePath } from "./wipe";

export type ShowcaseWipeTransition = {
  kind: "wipe";
  order: WipeOrder;
  path: WipePath;
};

export type ShowcaseListTransition = {
  kind: "list";
  /** One coordinate per step; length rows * cols. Each step sets that cell to 1. */
  coords: { row: number; col: number }[];
};

export type ShowcaseTransitionSpec = ShowcaseWipeTransition | ShowcaseListTransition;

function shuffledCellOrder(rows: number, cols: number): { row: number; col: number }[] {
  const idx = Array.from({ length: rows * cols }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = idx[i];
    idx[i] = idx[j]!;
    idx[j] = t!;
  }
  return idx.map((i) => ({ row: Math.floor(i / cols), col: i % cols }));
}

function centerOutOrder(rows: number, cols: number): { row: number; col: number }[] {
  const cr = (rows - 1) / 2;
  const cc = (cols - 1) / 2;
  const cells: { row: number; col: number; dist: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dist = Math.abs(r - cr) + Math.abs(c - cc);
      cells.push({ row: r, col: c, dist });
    }
  }
  cells.sort((a, b) => a.dist - b.dist || a.row - b.row || a.col - b.col);
  return cells.map(({ row, col }) => ({ row, col }));
}

/**
 * Pick a spotlight transition from the current trait index so each beat feels different.
 */
export function pickShowcaseTransition(traitIndex: number, rows: number, cols: number): ShowcaseTransitionSpec {
  const i = traitIndex % 6;
  switch (i) {
    case 0:
      return { kind: "wipe", order: "rows", path: "snake" };
    case 1:
      return { kind: "wipe", order: "columns", path: "snake" };
    case 2:
      return { kind: "list", coords: shuffledCellOrder(rows, cols) };
    case 3:
      return { kind: "list", coords: centerOutOrder(rows, cols) };
    case 4:
      return { kind: "wipe", order: "rows", path: "linear" };
    default:
      return { kind: "wipe", order: "columns", path: "linear" };
  }
}
