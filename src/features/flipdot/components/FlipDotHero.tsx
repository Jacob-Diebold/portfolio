"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { site } from "@/lib/site";

import { useFlipDotBoard } from "../engine/useFlipDotBoard";
import { useFlipDotTick } from "../engine/useFlipDotTick";
import { useFlipDotWipeTick } from "../engine/useFlipDotWipeTick";
import { applyRandomDots } from "../modes/random";
import { pickShowcaseTransition } from "../modes/showcaseTransitions";
import { stepWipe } from "../modes/wipe";
import type { WipeCursor, WipePath } from "../modes/wipe";
import {
  SHOWCASE_HOLD_MS,
  SHOWCASE_SCROLL_MS,
  SHOWCASE_TRAITS,
  SHOWCASE_WIPE_MS,
} from "../data/traits";
import { measureTextWidth } from "../text/bitmap";
import { buildMessageRaster, renderStringToBoard, sliceScrollWindow } from "../text/layout";
import type { DisplayModeId, FlipDotBoardProps, FlipDotHeroProps } from "../types/flipdot";
import FlipDotContainer from "../layout/FlipDotContainer";

const MODE_ORDER: DisplayModeId[] = [
  "traitsShowcase",
  "textStatic",
  "textScroll",
  "random",
  "wipeRows",
  "wipeColumns",
];

const MODE_LABEL: Record<DisplayModeId, string> = {
  traitsShowcase: "Spotlight",
  textStatic: "Static",
  textScroll: "Scroll",
  random: "Random",
  wipeRows: "Wipe rows",
  wipeColumns: "Wipe columns",
};

const WIPE_MODES: ReadonlySet<DisplayModeId> = new Set(["wipeRows", "wipeColumns"]);

type ShowcasePhase = "hold" | "scroll" | "wipe";

export function FlipDotHero({
  rows: initialRows = 8,
  cols: initialCols = 60,
  colors,
  defaultMode = "traitsShowcase",
  defaultText = "HELLO",
  tickIntervalMs: initialTickMs = 350,
  defaultHoverToPaint = true,
}: FlipDotHeroProps) {
  const [rows] = useState(initialRows);
  const [cols] = useState(initialCols);
  const [mode, setMode] = useState<DisplayModeId>(defaultMode);
  const [text, setText] = useState(defaultText);
  const [tickMs, setTickMs] = useState(initialTickMs);
  const [wipePath, setWipePath] = useState<WipePath>("linear");
  const [hoverToPaint, setHoverToPaint] = useState(defaultHoverToPaint);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [traitIndex, setTraitIndex] = useState(0);
  const [showcasePhase, setShowcasePhase] = useState<ShowcasePhase>("hold");

  const { board, setCell, replaceBoard, setBoard } = useFlipDotBoard(rows, cols);

  const boardRef = useRef(board);
  const modeRef = useRef(mode);
  const colsRef = useRef(cols);

  useLayoutEffect(() => {
    boardRef.current = board;
    modeRef.current = mode;
    colsRef.current = cols;
  });

  const scrollPackRef = useRef<{ raster: number[][]; width: number } | null>(null);
  const scrollPosRef = useRef(0);
  const showcaseScrollPackRef = useRef<{ raster: number[][]; width: number } | null>(null);
  const showcaseScrollPosRef = useRef(0);
  const showcaseScrollMaxRef = useRef(0);

  const wipeCursorRef = useRef<WipeCursor>({ cellIndex: 0, pass: 1 });
  const wipePassRef = useRef<0 | 1>(1);
  const showcaseWipeCursorRef = useRef<WipeCursor>({ cellIndex: 0, pass: 1 });

  const applyMode = (id: DisplayModeId) => {
    setMode(id);
    if (id === "traitsShowcase") {
      setTraitIndex(0);
      setShowcasePhase("hold");
    }
  };

  /* —— Spotlight: static if it fits, otherwise auto-scroll before transitioning —— */
  useEffect(() => {
    if (mode !== "traitsShowcase") return;
    if (showcasePhase !== "hold") return;

    const trait = SHOWCASE_TRAITS[traitIndex] ?? "";
    const fits = measureTextWidth(trait.toUpperCase()) <= cols;
    if (!fits) {
      const pack = buildMessageRaster(trait, rows, 1, cols);
      showcaseScrollPackRef.current = pack;
      showcaseScrollPosRef.current = 0;
      showcaseScrollMaxRef.current = Math.max(0, pack.width - cols);
      replaceBoard(sliceScrollWindow(pack.raster, 0, cols, false));
      setShowcasePhase("scroll");
      return;
    }

    replaceBoard(renderStringToBoard(trait, rows, cols));
    const id = window.setTimeout(() => setShowcasePhase("wipe"), SHOWCASE_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [mode, showcasePhase, traitIndex, rows, cols, replaceBoard]);

  useEffect(() => {
    if (mode !== "traitsShowcase" || showcasePhase !== "scroll") return;

    const id = window.setInterval(() => {
      const pack = showcaseScrollPackRef.current;
      if (!pack || pack.width === 0) {
        setShowcasePhase("wipe");
        return;
      }
      const max = showcaseScrollMaxRef.current;
      const nextPos = Math.min(showcaseScrollPosRef.current + 1, max);
      showcaseScrollPosRef.current = nextPos;
      replaceBoard(sliceScrollWindow(pack.raster, nextPos, cols, false));
      if (nextPos >= max) {
        window.clearInterval(id);
        setShowcasePhase("wipe");
      }
    }, SHOWCASE_SCROLL_MS);

    return () => window.clearInterval(id);
  }, [mode, showcasePhase, cols, replaceBoard]);

  useEffect(() => {
    if (mode !== "traitsShowcase" || showcasePhase !== "wipe") return;
    const spec = pickShowcaseTransition(traitIndex, rows, cols);
    const total = rows * cols;
    let steps = 0;

    const finish = (id: number) => {
      window.clearInterval(id);
      setTraitIndex((i) => (i + 1) % SHOWCASE_TRAITS.length);
      setShowcasePhase("hold");
    };

    if (spec.kind === "wipe") {
      const firstCell = boardRef.current[0]?.[0] ?? 0;
      const nextPass: 0 | 1 = firstCell === 0 ? 1 : 0;
      showcaseWipeCursorRef.current = { cellIndex: 0, pass: nextPass };
      const id = window.setInterval(() => {
        const prev = boardRef.current;
        const { nextBoard, nextCursor } = stepWipe(
          prev,
          rows,
          cols,
          showcaseWipeCursorRef.current,
          spec.order,
          spec.path,
        );
        showcaseWipeCursorRef.current = nextCursor;
        replaceBoard(nextBoard);
        steps += 1;
        if (steps >= total) finish(id);
      }, SHOWCASE_WIPE_MS);
      return () => window.clearInterval(id);
    }

    const id = window.setInterval(() => {
      const prev = boardRef.current;
      const next = prev.map((r) => r.slice());
      const cell = spec.coords[steps];
      if (cell) {
        next[cell.row][cell.col] = 1;
      }
      replaceBoard(next);
      steps += 1;
      if (steps >= total) finish(id);
    }, SHOWCASE_WIPE_MS);
    return () => window.clearInterval(id);
  }, [mode, showcasePhase, traitIndex, rows, cols, replaceBoard]);

  useEffect(() => {
    if (mode !== "textStatic") return;
    replaceBoard(renderStringToBoard(text, rows, cols));
  }, [mode, text, rows, cols, replaceBoard]);

  useEffect(() => {
    if (mode !== "textScroll") return;
    const pack = buildMessageRaster(text, rows, 1, cols - 5);
    scrollPackRef.current = pack;
    scrollPosRef.current = 0;
    if (pack.width > 0) {
      replaceBoard(sliceScrollWindow(pack.raster, 0, cols, true));
    }
  }, [mode, text, rows, cols, replaceBoard]);

  useEffect(() => {
    if (!WIPE_MODES.has(mode)) return;
    const firstCell = boardRef.current[0]?.[0] ?? 0;
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

      if (m === "textScroll") {
        const pack = scrollPackRef.current;
        if (!pack || pack.width === 0) return;
        scrollPosRef.current = (scrollPosRef.current + 1) % pack.width;
        replaceBoard(sliceScrollWindow(pack.raster, scrollPosRef.current, c, true));
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
    <div className="relative isolate px-3 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% -15%, color-mix(in oklch, var(--foreground), transparent 92%), transparent 55%)",
        }}
      />

      <h1 id="hero-heading" className="sr-only">
        {site.name} — flip-dot display
      </h1>

      <div className="relative mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-b from-card/95 via-card/50 to-muted/25 shadow-[0_20px_60px_-28px_rgba(0,0,0,0.35)] ring-1 ring-foreground/6 dark:from-card/50 dark:via-background/40 dark:shadow-[0_28px_64px_-20px_rgba(0,0,0,0.65)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-border/60 bg-background/65 px-3 py-2 text-[10px] tracking-wide text-muted-foreground uppercase backdrop-blur-sm sm:px-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Interactive board
            </span>
            <span className="truncate">Mode: {MODE_LABEL[mode]}</span>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-3 top-10 z-20 size-9 rounded-full border border-border/70 bg-background/85 shadow-md backdrop-blur-md hover:bg-background sm:top-11 sm:size-10"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open flip-dot display settings"
          >
            <Settings2 className="size-4" />
          </Button>

          <div className="h-[min(48vh,440px)] w-full min-h-48 pt-8 sm:h-[min(52vh,460px)] sm:min-h-56 sm:pt-9">
            <FlipDotContainer
              rows={rows}
              cols={cols}
              board={board}
              colors={colors}
              onSetCell={onSetCell}
              hoverToPaint={hoverToPaint}
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-border/60 bg-background/60 px-3 py-2 text-[11px] text-muted-foreground backdrop-blur-sm sm:px-4">
            Tap and drag to draw dots. Open settings to switch modes.
          </div>
        </div>
      </div>

      <Dialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        title="Flip-dot display"
        description="Modes, timing, painting behavior, and custom text. You can always doodle on the board."
      >
        <div className="flex flex-col gap-5">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Mode
            </p>
            <div className="flex flex-col gap-2">
              {MODE_ORDER.map((id) => (
                <Button
                  key={id}
                  type="button"
                  variant={mode === id ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => applyMode(id)}
                >
                  {MODE_LABEL[id]}
                </Button>
              ))}
            </div>
          </div>

          {WIPE_MODES.has(mode) ? (
            <>
              <Separator />
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Wipe path
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={wipePath === "linear" ? "secondary" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setWipePath("linear")}
                  >
                    Order
                  </Button>
                  <Button
                    type="button"
                    variant={wipePath === "snake" ? "secondary" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setWipePath("snake")}
                  >
                    Snake
                  </Button>
                </div>
              </div>
            </>
          ) : null}

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug">Hover to paint</p>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">
                Off: click and drag to paint (press flips the first dot, then drags that value).
              </p>
            </div>
            <Button
              type="button"
              role="switch"
              aria-checked={hoverToPaint}
              variant={hoverToPaint ? "default" : "outline"}
              size="sm"
              className="shrink-0 rounded-full px-4"
              onClick={() => setHoverToPaint((v) => !v)}
            >
              {hoverToPaint ? "On" : "Off"}
            </Button>
          </div>

          <Separator />

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Scroll / random tick (ms)
            </span>
            <input
              type="number"
              min={16}
              max={2000}
              step={8}
              value={tickMs}
              onChange={(e) => setTickMs(Number(e.target.value) || 80)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>

          <Separator />

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Custom text
            </span>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={mode === "traitsShowcase"}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              autoComplete="off"
            />
            {mode === "traitsShowcase" ? (
              <span className="text-xs text-muted-foreground">
                Spotlight cycles built-in phrases. Choose Static or Scroll to use your text.
              </span>
            ) : null}
          </label>
        </div>
      </Dialog>
    </div>
  );
}
