import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { DISCLAIMER_TICKER } from "@/lib/disclaimer-ticker-config";
import styles from "./DisclaimerTicker.module.css";

function TickerStar() {
  return (
    <Image
      src="/disclaimer/star.svg"
      alt=""
      width={20}
      height={20}
      className={styles.star}
      aria-hidden
      draggable={false}
    />
  );
}

function TickerItems() {
  const [firstLabel, secondLabel] = DISCLAIMER_TICKER.labels;

  return (
    <>
      {Array.from({ length: DISCLAIMER_TICKER.repeatCount }, (_, index) => (
        <Fragment key={index}>
          <span className={styles.label}>{firstLabel}</span>
          <TickerStar />
          <span className={styles.label}>{secondLabel}</span>
          <TickerStar />
        </Fragment>
      ))}
    </>
  );
}

export default function DisclaimerTicker() {
  const texture = DISCLAIMER_TICKER.textureUrl
    ? `url("${DISCLAIMER_TICKER.textureUrl}")`
    : "none";

  const tickerStyle = {
    "--ticker-rotation": `${DISCLAIMER_TICKER.rotation}deg`,
    "--ticker-top-offset": DISCLAIMER_TICKER.topOffsetDesktop,
    "--ticker-top-offset-mobile": DISCLAIMER_TICKER.topOffsetMobile,
    "--ticker-horizontal-offset": DISCLAIMER_TICKER.horizontalOffset,
    "--ticker-width": DISCLAIMER_TICKER.width,
    "--ticker-bg": DISCLAIMER_TICKER.background,
    "--ticker-text": DISCLAIMER_TICKER.textColor,
    "--ticker-texture": texture,
    "--ticker-marquee-duration": `${DISCLAIMER_TICKER.marqueeDuration}s`,
  } as CSSProperties;

  return (
    <section
      className={styles.section}
      aria-label={`${DISCLAIMER_TICKER.labels[0]}, ${DISCLAIMER_TICKER.labels[1]}`}
    >
      <div className={styles.outer} style={tickerStyle}>
        <div className={styles.rotated}>
          <div className={styles.strip}>
            <div className={styles.marqueeTrack}>
              <div className={styles.track}>
                <TickerItems />
              </div>
              <div className={styles.track} aria-hidden>
                <TickerItems />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
