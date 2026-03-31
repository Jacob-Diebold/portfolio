"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import {
  stepWipe,
  WIPE_MS_PER_STEP,
  type WipeCursor,
  type WipeOrder,
  type WipePath,
} from "../modes/wipe";

type UseFlipDotWipeTickArgs = {
  enabled: boolean;
  order: WipeOrder;
  path: WipePath;
  rows: number;
  cols: number;
  /** Must be updated to `board` every render (e.g. `boardRef.current = board`). */
  boardRef: MutableRefObject<number[][]>;
  replaceBoard: (next: number[][]) => void;
  cursorRef: MutableRefObject<WipeCursor>;
  /** Updated each step so re-entering wipe can keep the same pass phase. */
  passSeedRef: MutableRefObject<0 | 1>;
};

/**
 * Wipe runs on its own interval (see {@link WIPE_MS_PER_STEP}), separate from
 * {@link useFlipDotTick}. Steps apply via {@link replaceBoard} with cursor refs
 * updated outside React state updaters so Strict Mode double-invocation cannot
 * skip cells.
 */
export function useFlipDotWipeTick({
  enabled,
  order,
  path,
  rows,
  cols,
  boardRef,
  replaceBoard,
  cursorRef,
  passSeedRef,
}: UseFlipDotWipeTickArgs): void {
  const replaceBoardRef = useRef(replaceBoard);
  replaceBoardRef.current = replaceBoard;

  useEffect(() => {
    if (!enabled) return;

    const id = window.setInterval(() => {
      const prev = boardRef.current;
      const { nextBoard, nextCursor } = stepWipe(prev, rows, cols, cursorRef.current, order, path);
      cursorRef.current = nextCursor;
      passSeedRef.current = nextCursor.pass;
      replaceBoardRef.current(nextBoard);
    }, WIPE_MS_PER_STEP);

    return () => clearInterval(id);
  }, [enabled, order, path, rows, cols, boardRef, cursorRef, passSeedRef]);
}
