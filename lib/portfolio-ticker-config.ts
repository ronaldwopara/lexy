/**
 * Portfolio ticker band — tweak layout and styling here only.
 *
 * WHERE TO ADJUST
 * - `rotation` — band tilt (degrees). Negative = counter-clockwise (e.g. -12).
 * - `topOffsetDesktop` — how high the band sits on desktop (%, px). More negative = higher.
 * - `horizontalOffset` — nudge left/right from center. Negative = left, positive = right.
 * - `width` — band width. Wider than 100vw so tilted edges stay off-screen.
 * - `marginBlockMobile` — vertical spacing on mobile when the band is in normal flow.
 * - `label` / `repeatCount` — text and how many times it repeats along the band.
 * - `marqueeDuration` — seconds for one full marquee loop (lower = faster).
 *
 * Fine-tune CSS in components/PortfolioTicker.module.css if needed.
 */

export const PORTFOLIO_TICKER = {
  /** Band tilt in degrees (negative = counter-clockwise) */
  rotation: -12,

  /** Desktop vertical position — applied to the outer wrapper `top` */
  topOffsetDesktop: "-3%",

  /** Horizontal nudge from center (negative = left, positive = right) */
  horizontalOffset: "0px",

  /** Band width — 120vw keeps edges hidden when rotated */
  width: "120vw",

  /** Anchor the rotated band to the bottom of its wrapper */
  anchorBottom: "0",

  /** Vertical margin on mobile (band sits in document flow) */
  marginBlockMobile: "2.5rem",

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
  textureUrl: "public/line-texture.webp",
} as const;
