/**
 * One short line per beat (~6 chars max for cols≈40 with 5-wide glyphs; two beats can spell a phrase).
 * Uppercase A–Z and space only for the bitmap font.
 */
export const SHOWCASE_TRAITS = [
  "JACOB DIEBOLD",
  "FULL STACK",
  "REACT",
  "REACT NATIVE",
  "MOBILE",
  "WEB",
  "AWS",
  "CI/CD",
  "DENVER",
  "COLORADO",
] as const;

/** Ms between trait text and the transition wipe. */
export const SHOWCASE_HOLD_MS = 3000;

/** Ms per frame when spotlight auto-scrolls an overlong phrase. */
export const SHOWCASE_SCROLL_MS = 150;

/** Ms per cell during the quick showcase wipe (not the manual wipe modes). */
export const SHOWCASE_WIPE_MS = 0;
