/**
 * Disclaimer ticker band — tweak layout and styling here only.
 *
 * WHERE TO ADJUST
 * - `rotation` — band tilt (degrees). Negative = counter-clockwise (e.g. -12).
 * - `topOffsetDesktop` / `topOffsetMobile` — vertical position in the hero.
 *   Lower values raise the band (e.g. "32%"). Higher values lower it (e.g. "55%").
 * - `horizontalOffset` — nudge left/right from center. Negative = left, positive = right.
 * - `width` — band width. Wider than 100vw so tilted edges stay off-screen.
 * - `labels` / `repeatCount` — alternating phrases and how many cycles repeat along the band.
 * - `marqueeDuration` — seconds for one full marquee loop (lower = faster).
 *
 * The ticker sits behind the headline and video stack (z-index 1).
 * Fine-tune CSS in components/DisclaimerTicker.module.css if needed.
 */

export const DISCLAIMER_TICKER = {
  /** Band tilt in degrees (negative = counter-clockwise) */
  rotation: -15,

  /** Desktop vertical position within the hero (lower = higher on screen) */
  topOffsetDesktop: "36%",

  /** Mobile vertical position within the hero (lower = higher on screen) */
  topOffsetMobile: "40%",

  /** Horizontal nudge from center (negative = left, positive = right) */
  horizontalOffset: "0px",

  /** Band width — 120vw keeps edges hidden when rotated */
  width: "130vw",

  /** Alternating phrases: first label, star, second label, star, … */
  labels: ["Schedule Orders", "Pickup Only"] as const,

  /** Full label–star–label–star cycles per track layer */
  repeatCount: 6,

  /** Seconds for one full marquee loop (lower = faster) */
  marqueeDuration: 40,

  /** Band colors */
  background: "#e85d04",
  textColor: "#000000",

  /**
   * Optional texture overlay (place file in /public).
   * Leave empty to skip.
   */
  textureUrl: "/line-texture.webp",
} as const;
