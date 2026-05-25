export interface HeroSocialCard {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  opacity: number;
  translateX: number;
  rotate: number;
  positionClass: "tiktok" | "instagram" | "youtube";
}

/**
 * Base placement + Framer transforms (before scroll drift).
 * Scroll drift caps: lib/social-scroll-config.ts
 * CSS positions (top/left/right): components/VideoSwiper.module.css (.socialCardTiktok, etc.)
 */
export const HERO_SOCIAL_CARDS: HeroSocialCard[] = [
  {
    id: "tiktok",
    src: "/social/tiktok-card.png",
    alt: "TikTok: 532.1k views, 89.9k likes",
    width: 400,
    height: 156,
    opacity: 0.839891,
    translateX: 12.808684,
    rotate: -4,
    positionClass: "tiktok",
  },
  {
    id: "instagram",
    src: "/social/insta-card.png",
    alt: "Instagram: 1.2m views, 150.2k likes",
    width: 394,
    height: 109,
    opacity: 0.839891,
    translateX: -22.415197,
    rotate: 7,
    positionClass: "instagram",
  },
  {
    id: "youtube",
    src: "/social/youtube-card.png",
    alt: "YouTube: 340.9k views, 75.5k likes",
    width: 427,
    height: 182,
    opacity: 0.839891,
    translateX: 12.808684,
    rotate: -7,
    positionClass: "youtube",
  },
];
