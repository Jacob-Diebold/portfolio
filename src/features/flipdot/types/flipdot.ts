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

export type FlipDotMode = "random" | "image" | "scroll" | "snake" | "text";
