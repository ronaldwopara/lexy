"use client";

import { useHeroScrollProgress } from "@/components/HeroScrollProvider";
import { isFinalHeadlinePhase } from "@/lib/headline-scroll";
import styles from "@/app/page.module.css";

export default function HeroLogo() {
  const progress = useHeroScrollProgress();
  const isActive = isFinalHeadlinePhase(progress);

  return (
    <a
      href="/"
      className={`${styles.logo} ${isActive ? styles.logoHighlighted : ""}`.trim()}
    >
      Lexy's Kitchen
    </a>
  );
}
