"use client";

import { useEffect, useRef } from "react";

export type UseFlipDotTickOptions = {
  intervalMs: number;
  enabled: boolean;
  onTick: (tickIndex: number) => void;
};

/**
 * Monotonic tick counter for automation modes. Pointer painting stays outside this (immediate updates).
 */
export function useFlipDotTick({ intervalMs, enabled, onTick }: UseFlipDotTickOptions): void {
  const onTickRef = useRef(onTick);
  const tickRef = useRef(0);
  onTickRef.current = onTick;

  useEffect(() => {
    if (!enabled || intervalMs <= 0) return;

    const id = window.setInterval(() => {
      tickRef.current += 1;
      onTickRef.current(tickRef.current);
    }, intervalMs);

    return () => clearInterval(id);
  }, [enabled, intervalMs]);
}
