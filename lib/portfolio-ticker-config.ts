/**
 * Portfolio ticker band — tweak layout and styling here only.
 *
 * WHERE TO ADJUST
 * - `rotation` — band tilt (degrees). Negative = counter-clockwise (e.g. -12).
 * - `topOffsetDesktop` / `topOffsetMobile` — vertical position in the hero.
 *   Lower values raise the band (e.g. "32%"). Higher values lower it (e.g. "55%").
 * - `horizontalOffset` — nudge left/right from center. Negative = left, positive = right.
 * - `width` — band width. Wider than 100vw so tilted edges stay off-screen.
 * - `label` / `repeatCount` — text and how many times it repeats along the band.
 * - `marqueeDuration` — seconds for one full marquee loop (lower = faster).
 *
 * The ticker sits behind the headline and video stack (z-index 1).
 * Fine-tune CSS in components/PortfolioTicker.module.css if needed.
 */

export const PORTFOLIO_TICKER = {
  /** Band tilt in degrees (negative = counter-clockwise) */
  rotation: -12,

  /** Desktop vertical position within the hero (lower = higher on screen) */
  topOffsetDesktop: "36%",

  /** Mobile vertical position within the hero (lower = higher on screen) */
  topOffsetMobile: "32%",

  /** Horizontal nudge from center (negative = left, positive = right) */
  horizontalOffset: "0px",

  /** Band width — 120vw keeps edges hidden when rotated */
  width: "120vw",

  /** Repeated label along the band */
  label: "Portfolio",

  /** Label + star pairs rendered per track layer */
  repeatCount: 6,

  /** Seconds for one full marquee loop (lower = faster) */
  marqueeDuration: 24,

  /** Band colors */
  background: "#e85d04",
  textColor: "#000000",

  /**
   * Optional texture overlay (place file in /public).
   * Leave empty to skip.
   */
  textureUrl: "/line-texture.webp",
} as const;
