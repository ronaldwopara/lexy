/**
 * Social card scroll drift — tweak these values to control the scroll-linked animation.
 *
 * HOW IT WORKS
 * - Scroll (wheel or touch) drives `progress` from 0 → 1 while the hero stays fixed.
 * - Social cards, headline, logo, and Order Now sync to that progress.
 * - When progress hits 1, the page unlocks and normal scrolling continues.
 *
 * WHERE TO LOOK
 * - `scrollDistance` / `scrollDistanceMobile` — scroll input to finish animation (px)
 * - `cards.*.driftX / driftY` — where each card ends at progress = 1
 * - `scrollSensitivity` — speed multiplier
 * - app/page.module.css — `--hero-scroll-extra`, `--hero-scroll-extra-mobile`
 */

/** Match `--hero-scroll-extra` in app/page.module.css (desktop) */
export const SOCIAL_SCROLL_DISTANCE_PX = 600;

/** Match `--hero-scroll-extra-mobile` in app/page.module.css */
export const SOCIAL_SCROLL_DISTANCE_MOBILE_PX = 450;

export const SOCIAL_SCROLL_CONFIG = {
  /** Wheel / touch delta multiplier (1 = default) */
  scrollSensitivity: 1,

  /** Desktop scroll input (px) to finish animation */
  scrollDistance: SOCIAL_SCROLL_DISTANCE_PX,

  /** Mobile scroll input (px) to finish animation */
  scrollDistanceMobile: SOCIAL_SCROLL_DISTANCE_MOBILE_PX,

  /** Breakpoint for mobile scroll distance (px) */
  mobileBreakpoint: 768,

  /** Multiply all drift distances */
  driftMultiplier: 1,

  /**
   * End position at progress = 1 (px).
   * Negative X = left, positive X = right.
   */
  cards: {
    tiktok: {
      driftX: -140,
      driftY: -100,
    },
    instagram: {
      driftX: 230,
      driftY: -100,
    },
    youtube: {
      driftX: -120,
      driftY: 120,
    },
  },

  /** Fade opacity toward end of animation (0 = none) */
  fadeAtEnd: 0.15,
} as const;

export type SocialCardScrollId = keyof typeof SOCIAL_SCROLL_CONFIG.cards;

export function getSocialScrollOffset(
  cardId: SocialCardScrollId,
  progress: number,
): { x: number; y: number; opacityScale: number } {
  const { cards, driftMultiplier, fadeAtEnd } = SOCIAL_SCROLL_CONFIG;
  const card = cards[cardId];
  const t = Math.min(1, Math.max(0, progress));

  return {
    x: card.driftX * t * driftMultiplier,
    y: card.driftY * t * driftMultiplier,
    opacityScale: 1 - t * fadeAtEnd,
  };
}
