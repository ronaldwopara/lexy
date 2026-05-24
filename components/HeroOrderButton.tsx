"use client";

import { useHeroScrollProgress } from "@/components/HeroScrollProvider";
import { isFinalHeadlinePhase } from "@/lib/headline-scroll";
import styles from "@/app/page.module.css";

export default function HeroOrderButton() {
  const progress = useHeroScrollProgress();
  const isVisible = isFinalHeadlinePhase(progress);

  return (
    <a
      href="#order"
      className={`${styles.button} ${isVisible ? styles.buttonVisible : ""} ${
        isVisible ? styles.buttonActive : ""
      }`.trim()}
      aria-label="Order Now"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <span className={styles.buttonWord}>Order</span>
      <span className={styles.buttonRule} aria-hidden />
      <span className={styles.buttonWord}>Now</span>
    </a>
  );
}
