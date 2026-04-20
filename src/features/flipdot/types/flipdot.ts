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
  /**
   * When true (default), moving the pointer over a dot sets it to on without clicking.
   * When false, only click-and-drag applies paint (flip on press, then that value while dragging).
   */
  hoverToPaint?: boolean;
};

/** Display modes: static text applies immediately; scroll / random / wipe use tick hooks. */
export type DisplayModeId =
  | "traitsShowcase"
  | "textStatic"
  | "textScroll"
  | "random"
  | "wipeRows"
  | "wipeColumns";

export type FlipDotHeroProps = {
  rows?: number;
  cols?: number;
  /** Dot colors; typically from theme in page. */
  colors?: FlipDotBoardProps["colors"];
  /** Initial mode (default: traits spotlight cycle) */
  defaultMode?: DisplayModeId;
  /** Initial marquee / static string */
  defaultText?: string;
  /** Tick interval for random / scroll / wipe */
  tickIntervalMs?: number;
  /** Hover-to-paint: pointer move lights dots without a click. Default on. */
  defaultHoverToPaint?: boolean;
};
