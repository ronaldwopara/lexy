/**
 * Social card scroll drift — tweak these values to control the scroll-linked animation.
 *
 * HOW IT WORKS (large screens)
 * - Wheel / trackpad scroll drives `progress` from 0 → 1 while the page stays fixed.
 * - Social cards drift in sync with that progress.
 * - When progress hits 1, the page unlocks and normal scrolling continues.
 *
 * WHERE TO LOOK
 * - `scrollDistance` — how much scroll input completes the animation (px)
 * - `cards.*.driftX / driftY` — where each card ends up at progress = 1
 * - `scrollSensitivity` — speed multiplier for scroll input
 * - app/page.module.css — `--hero-scroll-extra` (spacer after hero, match scrollDistance)
 * - components/VideoSwiper.module.css — starting positions (.socialCardTiktok, etc.)
 */

export const SOCIAL_SCROLL_BREAKPOINT = 1024;

/** Match `--hero-scroll-extra` in app/page.module.css */
export const SOCIAL_SCROLL_DISTANCE_PX = 600;

export const SOCIAL_SCROLL_CONFIG = {
  /** Wheel delta multiplier (1 = default, 1.5 = faster animation) */
  scrollSensitivity: 1,

  /** Scroll input (px) required to finish the card animation */
  scrollDistance: SOCIAL_SCROLL_DISTANCE_PX,

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
      driftX: 160,
      driftY: -80,
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
