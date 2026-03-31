"use client";

import { useEffect, useRef, useState } from "react";
import { useFlipDotBoard } from "../engine/useFlipDotBoard";
import { useFlipDotTick } from "../engine/useFlipDotTick";
import { useFlipDotWipeTick } from "../engine/useFlipDotWipeTick";
import { applyRandomDots } from "../modes/random";
import { buildMessageRaster, renderStringToBoard, sliceScrollWindow } from "../text/layout";
import type { DisplayModeId, FlipDotBoardProps, FlipDotHeroProps } from "../types/flipdot";
import type { WipeCursor, WipePath } from "../modes/wipe";
import FlipDotContainer from "../layout/FlipDotContainer";
import { Button } from "@/components/ui/button";

const MODE_ORDER: DisplayModeId[] = [
  "textStatic",
  "textScroll",
  "random",
  "wipeRows",
  "wipeColumns",
];

const MODE_LABEL: Record<DisplayModeId, string> = {
  textStatic: "Static",
  textScroll: "Scroll",
  random: "Random",
  wipeRows: "Wipe rows",
  wipeColumns: "Wipe columns",
};

const WIPE_MODES: ReadonlySet<DisplayModeId> = new Set(["wipeRows", "wipeColumns"]);

export function FlipDotHero({
  rows: initialRows = 8,
  cols: initialCols = 60,
  colors,
  defaultMode = "textScroll",
  defaultText = "JACOB DIEBOLD",
  tickIntervalMs: initialTickMs = 350,
}: FlipDotHeroProps) {
  const [rows] = useState(initialRows);
  const [cols] = useState(initialCols);
  const [mode, setMode] = useState<DisplayModeId>(defaultMode);
  const [text, setText] = useState(defaultText);
  const [tickMs, setTickMs] = useState(initialTickMs);
  const [wipePath, setWipePath] = useState<WipePath>("linear");

  const { board, setCell, replaceBoard, setBoard } = useFlipDotBoard(rows, cols);

  const boardRef = useRef(board);
  boardRef.current = board;

  const modeRef = useRef(mode);
  const colsRef = useRef(cols);
  modeRef.current = mode;
  colsRef.current = cols;

  const scrollPackRef = useRef<{ raster: number[][]; width: number } | null>(null);
  const scrollPosRef = useRef(0);

  const wipeCursorRef = useRef<WipeCursor>({ cellIndex: 0, pass: 1 });
  const wipePassRef = useRef<0 | 1>(1);

  useEffect(() => {
    if (mode !== "textStatic") return;
    replaceBoard(renderStringToBoard(text, rows, cols));
  }, [mode, text, rows, cols, replaceBoard]);

  useEffect(() => {
    if (mode !== "textScroll") return;
    /** Leading blank spans a full viewport so the message first appears on the right edge, then scrolls left. */
    const pack = buildMessageRaster(text, rows, 1, cols - 5);
    scrollPackRef.current = pack;
    scrollPosRef.current = 0;
    if (pack.width > 0) {
      replaceBoard(sliceScrollWindow(pack.raster, 0, cols));
    }
  }, [mode, text, rows, cols, replaceBoard]);

  useEffect(() => {
    if (!WIPE_MODES.has(mode)) return;
    const firstCell = board[0][0];
    wipePassRef.current = firstCell === 0 ? 1 : 0;
    wipeCursorRef.current = { cellIndex: 0, pass: wipePassRef.current };
  }, [mode, rows, cols]);

  useFlipDotWipeTick({
    enabled: WIPE_MODES.has(mode),
    order: mode === "wipeColumns" ? "columns" : "rows",
    path: wipePath,
    rows,
    cols,
    boardRef,
    replaceBoard,
    cursorRef: wipeCursorRef,
    passSeedRef: wipePassRef,
  });

  const tickEnabled = mode === "random" || mode === "textScroll";

  useFlipDotTick({
    intervalMs: tickMs,
    enabled: tickEnabled,
    onTick: () => {
      const m = modeRef.current;
      const c = colsRef.current;

      // Scroll: advance ref + replaceBoard outside setState — Strict Mode can run functional updaters twice,
      // which would skip columns if scrollPosRef were mutated inside setBoard.
      if (m === "textScroll") {
        const pack = scrollPackRef.current;
        if (!pack || pack.width === 0) return;
        scrollPosRef.current = (scrollPosRef.current + 1) % pack.width;
        replaceBoard(sliceScrollWindow(pack.raster, scrollPosRef.current, c));
        return;
      }

      if (m === "random") {
        setBoard((prev) => applyRandomDots(prev, 14));
      }
    },
  });

  const onSetCell: NonNullable<FlipDotBoardProps["onSetCell"]> = (row, col, value) => {
    setCell(row, col, value);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2 px-2">
        {MODE_ORDER.map((id) => (
          <Button
            key={id}
            type="button"
            variant={mode === id ? "default" : "outline"}
            size="sm"
            onClick={() => setMode(id)}
          >
            {MODE_LABEL[id]}
          </Button>
        ))}
        {WIPE_MODES.has(mode) && (
          <span className="flex flex-wrap items-center gap-1 border-l border-border pl-2">
            <span className="text-xs text-muted-foreground">Wipe path</span>
            <Button
              type="button"
              variant={wipePath === "linear" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setWipePath("linear")}
            >
              Order
            </Button>
            <Button
              type="button"
              variant={wipePath === "snake" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setWipePath("snake")}
            >
              Snake
            </Button>
          </span>
        )}
        <label className="ml-2 flex items-center gap-1 text-sm text-muted-foreground">
          <span className="whitespace-nowrap">Tick ms</span>
          <input
            type="number"
            min={16}
            max={2000}
            step={8}
            value={tickMs}
            onChange={(e) => setTickMs(Number(e.target.value) || 80)}
            className="w-20 rounded-md border border-input bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>
      <div className="flex justify-center px-2">
        <label className="flex w-full max-w-xl flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Text (static / scroll)</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-base"
            autoComplete="off"
          />
        </label>
      </div>
      <div className="h-[min(50vh,420px)] w-full min-h-50">
        <FlipDotContainer
          rows={rows}
          cols={cols}
          board={board}
          colors={colors}
          onSetCell={onSetCell}
        />
      </div>
    </div>
  );
}
