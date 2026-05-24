"use client";

import { useHeroScrollProgress } from "@/components/HeroScrollProvider";
import { isHeadlineWordActive } from "@/lib/headline-scroll";
import styles from "@/app/page.module.css";

const HEADLINE_WORDS = [
  { text: "Soul", lineBreakAfter: false },
  { text: "Food,", lineBreakAfter: true },
  { text: "Cakes", lineBreakAfter: false },
  { text: "and", lineBreakAfter: true },
  { text: "Catering", lineBreakAfter: false },
] as const;

export default function HeroHeadline() {
  const progress = useHeroScrollProgress();
  const totalWords = HEADLINE_WORDS.length;

  return (
    <h1 className={styles.headline}>
      {HEADLINE_WORDS.map((word, index) => (
        <span key={word.text}>
          <span
            className={
              isHeadlineWordActive(index, totalWords, progress)
                ? styles.headlineWordHighlighted
                : styles.headlineWord
            }
          >
            {word.text}
          </span>
          {index < totalWords - 1 && !word.lineBreakAfter && " "}
          {word.lineBreakAfter && <br />}
        </span>
      ))}
    </h1>
  );
}
