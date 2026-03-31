export type FlipDotBoardProps = {
  rows: number;
  cols: number;
  board: number[][]; // 0 or 1
  /** Cylinder: rim, face toward camera when cell is 0, face toward camera when cell is 1 */
  colors?: {
    rim: string;
    off: string;
    on: string;
  };
  /**
   * Pointer painting: press on a dot flips that cell to the opposite (0→1 or 1→0), then the same
   * value is applied to every cell dragged over until release.
   */
  onSetCell?: (row: number, col: number, value: 0 | 1) => void;
};

/** Display modes: static text applies immediately; scroll / random / wipe use tick hooks. */
export type DisplayModeId = "textStatic" | "textScroll" | "random" | "wipeRows" | "wipeColumns";

export type FlipDotHeroProps = {
  rows?: number;
  cols?: number;
  /** Dot colors; typically from theme in page. */
  colors?: FlipDotBoardProps["colors"];
  /** Initial mode */
  defaultMode?: DisplayModeId;
  /** Initial marquee / static string */
  defaultText?: string;
  /** Tick interval for random / scroll / wipe */
  tickIntervalMs?: number;
};
