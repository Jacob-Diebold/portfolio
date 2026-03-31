/** Tunable silhouette for a single flip-dot disk (world units before centering). */
export const FLIP_DOT_SHAPE_DEFAULTS = {
  radius: 0.45,
  thickness: 0.05,
  notchShoulderX: 0.14,
  notchDepth: 0.2,
  /** Bezier handle scale across the notch opening (0–1). */
  notchBezierInset: 0.85,
  curveSegments: 48,
} as const;

export type FlipDotShapeOptions = {
  radius: number;
  thickness: number;
  notchShoulderX: number;
  notchDepth: number;
  notchBezierInset: number;
  curveSegments: number;
};
