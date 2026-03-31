"use client";

import { useCallback, useEffect, useState } from "react";
import { createRandomBoard } from "../utils/board";

export function useFlipDotBoard(rows: number, cols: number) {
  const [board, setBoard] = useState<number[][]>(() => createRandomBoard(rows, cols));

  useEffect(() => {
    setBoard(createRandomBoard(rows, cols));
  }, [rows, cols]);

  /** Immediate single-cell update (pointer paint). */
  const setCell = useCallback((row: number, col: number, value: 0 | 1) => {
    setBoard((prev) => {
      if (row < 0 || row >= prev.length || col < 0 || col >= (prev[row]?.length ?? 0)) return prev;
      if ((prev[row][col] !== 0 ? 1 : 0) === value) return prev;
      const next = prev.map((r) => r.slice());
      next[row][col] = value;
      return next;
    });
  }, []);

  /** Full replace (static text, fill, scroll frame, etc.). */
  const replaceBoard = useCallback((next: number[][]) => {
    setBoard(next);
  }, []);

  return { board, setBoard, setCell, replaceBoard };
}
