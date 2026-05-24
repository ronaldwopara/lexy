"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import { HERO_SOCIAL_CARDS } from "@/lib/hero-social-cards";
import {
  getSocialScrollOffset,
  type SocialCardScrollId,
} from "@/lib/social-scroll-config";
import { useHeroScrollProgress } from "@/components/HeroScrollProvider";
import styles from "./VideoSwiper.module.css";

const DEFAULT_CARD_WIDTH = 357;
const DEFAULT_CARD_HEIGHT = 630;

/** Framer stack transforms (front → back) */
const STACK_LAYERS = [
  { translateX: 0, translateY: 0, translateZ: 0, scale: 1, rotate: 0 },
  { translateX: 25, translateY: -8, translateZ: -30, scale: 0.95, rotate: 4 },
  { translateX: 50, translateY: -16, translateZ: -60, scale: 0.9, rotate: 8 },
] as const;

function stackLayer(displayIndex: number) {
  if (displayIndex < STACK_LAYERS.length) {
    return STACK_LAYERS[displayIndex];
  }
  const last = STACK_LAYERS[STACK_LAYERS.length - 1];
  const extra = displayIndex - STACK_LAYERS.length + 1;
  return {
    translateX: last.translateX + extra * 25,
    translateY: last.translateY - extra * 8,
    translateZ: last.translateZ - extra * 30,
    scale: Math.max(0.8, last.scale - extra * 0.05),
    rotate: last.rotate + extra * 4,
  };
}

function layerTransform(displayIndex: number): string {
  const layer = stackLayer(displayIndex);
  if (displayIndex === 0) {
    return "none";
  }
  return `translateX(${layer.translateX}px) translateY(${layer.translateY}px) translateZ(${layer.translateZ}px) scale(${layer.scale}) rotate(${layer.rotate}deg)`;
}

function getStackStageSize(cardWidth: number, cardHeight: number) {
  return {
    stackWidth: cardWidth,
    stackHeight: cardHeight,
    stageWidth: cardWidth,
    stageHeight: cardHeight + 20,
  };
}

const SOCIAL_CARD_POSITION = {
  tiktok: styles.socialCardTiktok,
  instagram: styles.socialCardInstagram,
  youtube: styles.socialCardYoutube,
} as const;

interface VideoSwiperProps {
  videos: string;
  cardWidth?: number;
  cardHeight?: number;
  className?: string;
}

export default function VideoSwiper({
  videos,
  cardWidth = DEFAULT_CARD_WIDTH,
  cardHeight: cardHeightProp,
  className = "",
}: VideoSwiperProps) {
  const cardHeight = cardHeightProp ?? DEFAULT_CARD_HEIGHT;
  const scrollProgress = useHeroScrollProgress();
  const cardStackRef = useRef<HTMLDivElement>(null);
  const isSwiping = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const videoList = videos
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const [cardOrder, setCardOrder] = useState<number[]>(() =>
    Array.from({ length: videoList.length }, (_, i) => i),
  );

  const getDurationFromCSS = useCallback(
    (variableName: string, element?: HTMLElement | null): number => {
      const targetElement = element || document.documentElement;
      const value = getComputedStyle(targetElement)
        ?.getPropertyValue(variableName)
        ?.trim();
      if (!value) return 300;
      if (value.endsWith("ms")) return parseFloat(value);
      if (value.endsWith("s")) return parseFloat(value) * 1000;
      return parseFloat(value) || 300;
    },
    [],
  );

  const getCards = useCallback((): HTMLElement[] => {
    if (!cardStackRef.current) return [];
    return [
      ...cardStackRef.current.querySelectorAll("[data-video-card]"),
    ] as HTMLElement[];
  }, []);

  const getActiveCard = useCallback((): HTMLElement | null => {
    const cards = getCards();
    return cards[0] || null;
  }, [getCards]);

  const updatePositions = useCallback(() => {
    const cards = getCards();
    cards.forEach((card, i) => {
      if (i === 0) {
        card.style.setProperty("--swipe-x", "0px");
        card.style.setProperty("--swipe-rotate", "0deg");
      }
      card.style.opacity = "1";
    });
  }, [getCards]);

  const applySwipeStyles = useCallback(
    (deltaX: number) => {
      const card = getActiveCard();
      if (!card) return;
      card.style.setProperty("--swipe-x", `${deltaX}px`);
      card.style.setProperty("--swipe-rotate", `${deltaX * 0.12}deg`);
      card.style.opacity = (
        1 -
        Math.min(Math.abs(deltaX) / 100, 1) * 0.75
      ).toString();
    },
    [getActiveCard],
  );

  const animateCardOff = useCallback(
    (direction: 1 | -1, onComplete: () => void) => {
      const duration = getDurationFromCSS(
        "--card-swap-duration",
        cardStackRef.current,
      );
      const card = getActiveCard();
      if (!card) {
        onComplete();
        return;
      }

      card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
      card.style.setProperty("--swipe-x", `${direction * 300}px`);
      card.style.setProperty("--swipe-rotate", `${direction * 18}deg`);

      setTimeout(() => {
        if (getActiveCard() === card) {
          card.style.setProperty("--swipe-rotate", `${-direction * 12}deg`);
        }
      }, duration * 0.5);

      setTimeout(onComplete, duration);
    },
    [getDurationFromCSS, getActiveCard],
  );

  const advanceCard = useCallback(() => {
    if (videoList.length <= 1 || isSwiping.current) return;
    isSwiping.current = true;
    animateCardOff(1, () => {
      setCardOrder((prev) =>
        prev.length === 0 ? [] : [...prev.slice(1), prev[0]],
      );
      isSwiping.current = false;
    });
  }, [videoList.length, animateCardOff]);

  const retreatCard = useCallback(() => {
    if (videoList.length <= 1 || isSwiping.current) return;
    isSwiping.current = true;
    animateCardOff(-1, () => {
      setCardOrder((prev) =>
        prev.length === 0
          ? []
          : [prev[prev.length - 1], ...prev.slice(0, -1)],
      );
      isSwiping.current = false;
    });
  }, [videoList.length, animateCardOff]);

  const handleStart = useCallback(
    (clientX: number) => {
      if (isSwiping.current) return;
      isSwiping.current = true;
      startX.current = clientX;
      currentX.current = clientX;
      const card = getActiveCard();
      if (card) card.style.transition = "none";
    },
    [getActiveCard],
  );

  const handleEnd = useCallback(() => {
    if (!isSwiping.current) return;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    const deltaX = currentX.current - startX.current;
    const threshold = 50;
    const duration = getDurationFromCSS(
      "--card-swap-duration",
      cardStackRef.current,
    );
    const card = getActiveCard();

    if (card) {
      card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

      if (Math.abs(deltaX) > threshold) {
        const direction = Math.sign(deltaX) as 1 | -1;
        animateCardOff(direction, () => {
          setCardOrder((prev) => {
            if (prev.length === 0) return [];
            if (direction > 0) {
              return [...prev.slice(1), prev[0]];
            }
            return [prev[prev.length - 1], ...prev.slice(0, -1)];
          });
          isSwiping.current = false;
        });
        return;
      }
      applySwipeStyles(0);
    }

    isSwiping.current = false;
    startX.current = 0;
    currentX.current = 0;
  }, [
    getDurationFromCSS,
    getActiveCard,
    applySwipeStyles,
    animateCardOff,
  ]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isSwiping.current) return;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(() => {
        currentX.current = clientX;
        const deltaX = currentX.current - startX.current;
        applySwipeStyles(deltaX);

        if (Math.abs(deltaX) > 50) {
          handleEnd();
        }
      });
    },
    [applySwipeStyles, handleEnd],
  );

  useEffect(() => {
    const cardStackElement = cardStackRef.current;
    if (!cardStackElement) return;

    const handlePointerDown = (e: PointerEvent) => {
      handleStart(e.clientX);
    };
    const handlePointerMove = (e: PointerEvent) => {
      handleMove(e.clientX);
    };
    const handlePointerUp = () => {
      handleEnd();
    };

    cardStackElement.addEventListener("pointerdown", handlePointerDown);
    cardStackElement.addEventListener("pointermove", handlePointerMove);
    cardStackElement.addEventListener("pointerup", handlePointerUp);

    return () => {
      cardStackElement.removeEventListener("pointerdown", handlePointerDown);
      cardStackElement.removeEventListener("pointermove", handlePointerMove);
      cardStackElement.removeEventListener("pointerup", handlePointerUp);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleStart, handleMove, handleEnd]);

  useEffect(() => {
    updatePositions();
  }, [cardOrder, updatePositions]);

  useEffect(() => {
    const stack = cardStackRef.current;
    if (!stack) return;
    const elements = stack.querySelectorAll<HTMLVideoElement>("video");
    elements.forEach((video, index) => {
      if (index === 0) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [cardOrder]);

  if (videoList.length === 0) {
    return null;
  }

  const stackSize = getStackStageSize(cardWidth, cardHeight);

  const stackStyle = {
    width: stackSize.stackWidth,
    height: stackSize.stackHeight,
    "--card-swap-duration": "0.3s",
  } as CSSProperties;

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      <div
        className={styles.column}
        style={{ width: stackSize.stageWidth }}
      >
      <div
        className={styles.stackStage}
        style={{
          width: stackSize.stageWidth,
          height: stackSize.stageHeight,
        }}
      >
        <div className={styles.socialCards} aria-hidden>
          {HERO_SOCIAL_CARDS.map((card) => {
            const scroll = getSocialScrollOffset(
              card.id as SocialCardScrollId,
              scrollProgress,
            );
            return (
              <Image
                key={card.id}
                src={card.src}
                alt={card.alt}
                width={card.width}
                height={card.height}
                className={`${styles.socialCard} ${SOCIAL_CARD_POSITION[card.positionClass]}`}
                style={{
                  width: card.width,
                  opacity: card.opacity * scroll.opacityScale,
                  transform: `translateX(${card.translateX + scroll.x}px) translateY(${scroll.y}px) rotate(${card.rotate}deg)`,
                }}
                draggable={false}
              />
            );
          })}
        </div>
        <div className={styles.stack} ref={cardStackRef} style={stackStyle}>
        <div className={styles.stackGlow} aria-hidden />
        {cardOrder.map((originalIndex, displayIndex) => (
          <article
            key={`${videoList[originalIndex]}-${originalIndex}`}
            data-video-card
            className={`${styles.card} ${
              displayIndex === 0 ? styles.cardFront : styles.cardBack
            }`.trim()}
            style={
              {
                zIndex: videoList.length - displayIndex,
                transform:
                  displayIndex === 0
                    ? undefined
                    : layerTransform(displayIndex),
              } as CSSProperties
            }
          >
            <video
              className={styles.video}
              src={videoList[originalIndex]}
              muted
              loop
              playsInline
              preload="metadata"
            />
          </article>
        ))}
        <p className={styles.swipeHint} aria-hidden>
          ⬅ Swipe Me ➡
        </p>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={retreatCard}
          disabled={videoList.length <= 1}
          aria-label="Previous video"
        >
          <svg
            className={styles.navIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.navBtn}
          onClick={advanceCard}
          disabled={videoList.length <= 1}
          aria-label="Next video"
        >
          <svg
            className={styles.navIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      </div>
    </div>
  );
}
