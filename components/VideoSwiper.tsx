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

const VISIBLE_STACK_DEPTH = STACK_LAYERS.length;

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

function getDisplayCards(
  cardOrder: number[],
  dragDeltaX: number,
  visibleStackDepth: number,
) {
  if (dragDeltaX >= 0 || cardOrder.length <= 1) {
    return cardOrder.slice(0, visibleStackDepth).map((originalIndex, displayIndex) => ({
      originalIndex,
      displayIndex,
    }));
  }

  const previousIndex = cardOrder[cardOrder.length - 1];
  const cards: { originalIndex: number; displayIndex: number }[] = [
    { originalIndex: cardOrder[0], displayIndex: 0 },
    { originalIndex: previousIndex, displayIndex: 1 },
  ];

  if (visibleStackDepth > 2) {
    const thirdIndex = cardOrder[2];
    if (
      thirdIndex !== undefined &&
      thirdIndex !== cardOrder[0] &&
      thirdIndex !== previousIndex
    ) {
      cards.push({ originalIndex: thirdIndex, displayIndex: 2 });
    } else {
      for (let i = 1; i < cardOrder.length; i++) {
        const candidate = cardOrder[i];
        if (candidate === cardOrder[0] || candidate === previousIndex) continue;
        cards.push({ originalIndex: candidate, displayIndex: 2 });
        break;
      }
    }
  }

  return cards;
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

function parseVideoPaths(videos: string): string[] {
  return videos
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

interface VideoSwiperProps {
  videos: string;
  /** Comma-separated paths appended after idle (not requested on first paint) */
  deferredVideos?: string;
  cardWidth?: number;
  cardHeight?: number;
  className?: string;
}

export default function VideoSwiper({
  videos,
  deferredVideos = "",
  cardWidth = DEFAULT_CARD_WIDTH,
  cardHeight: cardHeightProp,
  className = "",
}: VideoSwiperProps) {
  const cardHeight = cardHeightProp ?? DEFAULT_CARD_HEIGHT;
  const scrollProgress = useHeroScrollProgress();
  const cardStackRef = useRef<HTMLDivElement>(null);
  const swipePhase = useRef<"idle" | "dragging" | "animating">("idle");
  const startX = useRef(0);
  const currentX = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const activePointerId = useRef<number | null>(null);

  const [videoList, setVideoList] = useState(() => parseVideoPaths(videos));
  const deferredPaths = useRef(parseVideoPaths(deferredVideos));
  const deferredAppended = useRef(false);

  const [cardOrder, setCardOrder] = useState<number[]>(() =>
    Array.from({ length: parseVideoPaths(videos).length }, (_, i) => i),
  );
  const [dragDeltaX, setDragDeltaX] = useState(0);

  useEffect(() => {
    const pending = deferredPaths.current;
    if (pending.length === 0 || deferredAppended.current) return;

    const appendDeferred = () => {
      if (deferredAppended.current) return;
      deferredAppended.current = true;

      setVideoList((prev) => {
        const base = prev.length;
        setCardOrder((order) => [
          ...order,
          ...Array.from({ length: pending.length }, (_, i) => base + i),
        ]);
        return [...prev, ...pending];
      });
      deferredPaths.current = [];
    };

    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(appendDeferred, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }

    const id = window.setTimeout(appendDeferred, 600);
    return () => window.clearTimeout(id);
  }, []);

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
    if (!cardStackRef.current) return null;
    return cardStackRef.current.querySelector(
      '[data-video-card][data-active="true"]',
    ) as HTMLElement | null;
  }, []);

  const updatePositions = useCallback(() => {
    const cards = getCards();
    cards.forEach((card) => {
      card.style.opacity = "1";
    });
    const front = getActiveCard();
    if (front) {
      front.style.setProperty("--swipe-x", "0px");
      front.style.setProperty("--swipe-rotate", "0deg");
    }
  }, [getCards, getActiveCard]);

  const applySwipeStyles = useCallback(
    (deltaX: number) => {
      const cards = getCards();
      cards.forEach((card) => {
        const isFront = card.dataset.active === "true";
        if (isFront) {
          card.style.setProperty("--swipe-x", `${deltaX}px`);
          card.style.setProperty("--swipe-rotate", `${deltaX * 0.12}deg`);
          card.style.opacity = (
            1 -
            Math.min(Math.abs(deltaX) / 100, 1) * 0.75
          ).toString();
        } else {
          card.style.removeProperty("--swipe-x");
          card.style.removeProperty("--swipe-rotate");
          card.style.opacity = "1";
        }
      });
    },
    [getCards],
  );

  const rotateOrder = useCallback((direction: 1 | -1) => {
    setCardOrder((prev) => {
      if (prev.length === 0) return [];
      if (direction > 0) {
        return [...prev.slice(1), prev[0]];
      }
      return [prev[prev.length - 1], ...prev.slice(0, -1)];
    });
  }, []);

  const dismissCard = useCallback(
    (direction: 1 | -1) => {
      if (videoList.length <= 1 || swipePhase.current === "animating") return;

      const duration = getDurationFromCSS(
        "--card-swap-duration",
        cardStackRef.current,
      );
      const card = getActiveCard();

      swipePhase.current = "animating";

      if (card) {
        card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        card.style.setProperty("--swipe-x", `${direction * 300}px`);
        card.style.setProperty("--swipe-rotate", `${direction * 18}deg`);
        card.style.opacity = "0";
      }

      window.setTimeout(() => {
        rotateOrder(direction);
        setDragDeltaX(0);
        swipePhase.current = "idle";
      }, duration);
    },
    [videoList.length, getDurationFromCSS, getActiveCard, rotateOrder],
  );

  const advanceCard = useCallback(() => {
    dismissCard(1);
  }, [dismissCard]);

  const retreatCard = useCallback(() => {
    dismissCard(-1);
  }, [dismissCard]);

  const handleStart = useCallback(
    (clientX: number) => {
      if (swipePhase.current !== "idle") return;
      swipePhase.current = "dragging";
      startX.current = clientX;
      currentX.current = clientX;
      setDragDeltaX(0);
      getCards().forEach((card) => {
        card.style.transition = "none";
      });
    },
    [getCards],
  );

  const visibleStackDepth = Math.min(VISIBLE_STACK_DEPTH, videoList.length);
  const displayCards = getDisplayCards(cardOrder, dragDeltaX, visibleStackDepth);
  const isDragging = dragDeltaX !== 0;

  const handleEnd = useCallback(() => {
    if (swipePhase.current !== "dragging") return;

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

    if (Math.abs(deltaX) > threshold) {
      const direction = Math.sign(deltaX) as 1 | -1;
      dismissCard(direction);
      startX.current = 0;
      currentX.current = 0;
      return;
    }

    if (card) {
      card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
      applySwipeStyles(0);
    }

    swipePhase.current = "idle";
    setDragDeltaX(0);
    startX.current = 0;
    currentX.current = 0;
  }, [
    getDurationFromCSS,
    getActiveCard,
    applySwipeStyles,
    dismissCard,
  ]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (swipePhase.current !== "dragging") return;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(() => {
        currentX.current = clientX;
        const nextDeltaX = clientX - startX.current;
        setDragDeltaX(nextDeltaX);
        applySwipeStyles(nextDeltaX);
      });
    },
    [applySwipeStyles],
  );

  useEffect(() => {
    const cardStackElement = cardStackRef.current;
    if (!cardStackElement) return;

    const releasePointer = (pointerId: number) => {
      if (activePointerId.current !== pointerId) return;
      if (cardStackElement.hasPointerCapture(pointerId)) {
        cardStackElement.releasePointerCapture(pointerId);
      }
      activePointerId.current = null;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || swipePhase.current !== "idle") return;
      activePointerId.current = e.pointerId;
      cardStackElement.setPointerCapture(e.pointerId);
      handleStart(e.clientX);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (activePointerId.current !== e.pointerId) return;
      handleMove(e.clientX);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (activePointerId.current !== e.pointerId) return;
      releasePointer(e.pointerId);
      handleEnd();
    };

    const handlePointerCancel = (e: PointerEvent) => {
      if (activePointerId.current !== e.pointerId) return;
      releasePointer(e.pointerId);
      handleEnd();
    };

    cardStackElement.addEventListener("pointerdown", handlePointerDown);
    cardStackElement.addEventListener("pointermove", handlePointerMove);
    cardStackElement.addEventListener("pointerup", handlePointerUp);
    cardStackElement.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      cardStackElement.removeEventListener("pointerdown", handlePointerDown);
      cardStackElement.removeEventListener("pointermove", handlePointerMove);
      cardStackElement.removeEventListener("pointerup", handlePointerUp);
      cardStackElement.removeEventListener(
        "pointercancel",
        handlePointerCancel,
      );
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
    stack.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
      const isFront =
        video.closest("[data-video-card]")?.getAttribute("data-active") ===
        "true";
      if (isFront) {
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
        <div
          className={styles.stack}
          ref={cardStackRef}
          data-video-swiper
          data-dragging={isDragging ? "true" : "false"}
          style={stackStyle}
        >
        {displayCards.map(({ originalIndex, displayIndex }) => (
          <article
            key={originalIndex}
            data-video-card
            data-active={displayIndex === 0}
            className={`${styles.card} ${
              displayIndex === 0 ? styles.cardFront : styles.cardBack
            }`.trim()}
            style={
              {
                zIndex: visibleStackDepth - displayIndex,
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
              autoPlay={displayIndex === 0}
              muted
              loop
              playsInline
              preload={displayIndex === 0 ? "auto" : "metadata"}
            />
          </article>
        ))}
        </div>
        <p className={styles.swipeHint} aria-hidden>
          ⬅ Swipe Me ➡
        </p>
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
