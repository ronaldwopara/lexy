/** Headline word count — keep in sync with HeroHeadline word list */
export const HEADLINE_WORD_COUNT = 5;

/** True on the last word segment and after (progress ≥ 0.8, including when scroll completes) */
export function isFinalHeadlinePhase(progress: number): boolean {
  return progress >= (HEADLINE_WORD_COUNT - 1) / HEADLINE_WORD_COUNT;
}

export function isHeadlineWordActive(
  wordIndex: number,
  totalWords: number,
  progress: number,
): boolean {
  if (progress <= 0) {
    return false;
  }

  const isLastWord = wordIndex === totalWords - 1;
  const segmentStart = wordIndex / totalWords;

  if (isLastWord) {
    return progress >= segmentStart;
  }

  if (progress >= 1) {
    return false;
  }

  const segmentEnd = (wordIndex + 1) / totalWords;
  return progress >= segmentStart && progress < segmentEnd;
}
