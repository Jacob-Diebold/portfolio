import { createEmptyBoard } from "../utils/board";
import { getGlyph, GLYPH_H, GLYPH_W, GLYPH_GAP, measureTextWidth } from "./bitmap";

function rowSliceOn(rowStr: string, x: number): 0 | 1 {
  if (x < 0 || x >= GLYPH_W) return 0;
  return rowStr[x] === "#" ? 1 : 0;
}

/** Blit one glyph top-left at (row0, col0) into board (clipped). */
export function blitGlyph(board: number[][], ch: string, row0: number, col0: number): void {
  const g = getGlyph(ch);
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  for (let dy = 0; dy < GLYPH_H; dy++) {
    const r = row0 + dy;
    if (r < 0 || r >= rows) continue;
    const rowStr = g[dy] ?? ".....";
    for (let dx = 0; dx < GLYPH_W; dx++) {
      const c = col0 + dx;
      if (c < 0 || c >= cols) continue;
      board[r][c] = rowSliceOn(rowStr, dx);
    }
  }
}

/** Centered static text on the board (uppercase subset of bitmap). */
export function renderStringToBoard(text: string, rows: number, cols: number): number[][] {
  const board = createEmptyBoard(rows, cols);
  const t = text.toUpperCase();
  const totalW = measureTextWidth(t);
  const row0 = Math.max(0, Math.floor((rows - GLYPH_H) / 2));
  let col0 = Math.floor((cols - totalW) / 2);
  if (col0 < 0) col0 = 0;

  let cursor = col0;
  for (let i = 0; i < t.length; i++) {
    blitGlyph(board, t[i], row0, cursor);
    cursor += GLYPH_W + GLYPH_GAP;
  }
  return board;
}

/**
 * Raster [rows][width] with text band vertically centered; off rows are 0.
 * @param leadingBlankCols — empty columns prepended so scroll can start with a blank board and the message entering from the right (use viewport width).
 */
export function buildMessageRaster(
  text: string,
  rows: number,
  repeat = 3,
  leadingBlankCols = 0,
): { raster: number[][]; width: number } {
  const base = (text.length > 0 ? text : " ").toUpperCase();
  const segmentW = measureTextWidth(base);
  const padW = GLYPH_W + GLYPH_GAP;
  const width = leadingBlankCols + segmentW * repeat + padW * 2;
  const raster = createEmptyBoard(rows, width);

  const row0 = Math.max(0, Math.floor((rows - GLYPH_H) / 2));

  for (let rep = 0; rep < repeat; rep++) {
    const startCol = leadingBlankCols + padW + rep * (segmentW + padW);
    let cursor = startCol;
    for (let i = 0; i < base.length; i++) {
      blitGlyph(raster, base[i], row0, cursor);
      cursor += GLYPH_W + GLYPH_GAP;
    }
  }

  return { raster, width };
}

/**
 * One frame of horizontal scroll: window [scroll..scroll+cols).
 * Set `wrap=true` for cyclic marquee behavior.
 */
export function sliceScrollWindow(
  raster: number[][],
  scroll: number,
  outCols: number,
  wrap = true,
): number[][] {
  const rows = raster.length;
  const w = raster[0]?.length ?? 0;
  if (w === 0) return createEmptyBoard(rows, outCols);

  const board = createEmptyBoard(rows, outCols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < outCols; c++) {
      const src = scroll + c;
      if (wrap) {
        board[r][c] = raster[r][((src % w) + w) % w] !== 0 ? 1 : 0;
      } else {
        board[r][c] = src >= 0 && src < w && raster[r][src] !== 0 ? 1 : 0;
      }
    }
  }
  return board;
}
