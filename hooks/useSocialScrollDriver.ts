"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SOCIAL_SCROLL_CONFIG } from "@/lib/social-scroll-config";

function getScrollDistance(): number {
  if (typeof window === "undefined") {
    return SOCIAL_SCROLL_CONFIG.scrollDistance;
  }
  return window.innerWidth <= SOCIAL_SCROLL_CONFIG.mobileBreakpoint
    ? SOCIAL_SCROLL_CONFIG.scrollDistanceMobile
    : SOCIAL_SCROLL_CONFIG.scrollDistance;
}

/**
 * Drives hero scroll animation. Page scroll is locked until progress reaches 1.
 */
export function useSocialScrollDriver(enabled: boolean) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const touchStartY = useRef(0);

  const setBodyLocked = useCallback((locked: boolean) => {
    document.body.style.overflow = locked ? "hidden" : "";
  }, []);

  const applyProgress = useCallback(
    (next: number) => {
      const clamped = Math.min(1, Math.max(0, next));
      progressRef.current = clamped;
      setProgress(clamped);
      setBodyLocked(clamped < 1);
    },
    [setBodyLocked],
  );

  useEffect(() => {
    if (!enabled) {
      applyProgress(0);
      setBodyLocked(false);
      return;
    }

    const { scrollSensitivity } = SOCIAL_SCROLL_CONFIG;

    const consumeDelta = (deltaY: number) => {
      const scrollY = window.scrollY;
      const p = progressRef.current;
      const scrollDistance = getScrollDistance();

      if (scrollY > 0) {
        return false;
      }

      if (p >= 1 && deltaY > 0) {
        return false;
      }

      if (p <= 0 && deltaY < 0) {
        return false;
      }

      applyProgress(p + (deltaY * scrollSensitivity) / scrollDistance);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (consumeDelta(e.deltaY)) {
        e.preventDefault();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchStartY.current;
      const deltaY = touchStartY.current - y;
      touchStartY.current = y;

      if (consumeDelta(deltaY)) {
        e.preventDefault();
      }
    };

    setBodyLocked(progressRef.current < 1);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      setBodyLocked(false);
    };
  }, [enabled, applyProgress, setBodyLocked]);

  return progress;
}
