import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { PORTFOLIO_TICKER } from "@/lib/portfolio-ticker-config";
import styles from "./PortfolioTicker.module.css";

function TickerItems() {
  return (
    <>
      {Array.from({ length: PORTFOLIO_TICKER.repeatCount }, (_, index) => (
        <Fragment key={index}>
          <span className={styles.label}>{PORTFOLIO_TICKER.label}</span>
          <Image
            src="/portfolio/star.svg"
            alt=""
            width={20}
            height={20}
            className={styles.star}
            aria-hidden
            draggable={false}
          />
        </Fragment>
      ))}
    </>
  );
}

export default function PortfolioTicker() {
  const texture = PORTFOLIO_TICKER.textureUrl
    ? `url("${PORTFOLIO_TICKER.textureUrl}")`
    : "none";

  const tickerStyle = {
    "--ticker-rotation": `${PORTFOLIO_TICKER.rotation}deg`,
    "--ticker-top-offset": PORTFOLIO_TICKER.topOffsetDesktop,
    "--ticker-top-offset-mobile": PORTFOLIO_TICKER.topOffsetMobile,
    "--ticker-horizontal-offset": PORTFOLIO_TICKER.horizontalOffset,
    "--ticker-width": PORTFOLIO_TICKER.width,
    "--ticker-bg": PORTFOLIO_TICKER.background,
    "--ticker-text": PORTFOLIO_TICKER.textColor,
    "--ticker-texture": texture,
    "--ticker-marquee-duration": `${PORTFOLIO_TICKER.marqueeDuration}s`,
  } as CSSProperties;

  return (
    <section className={styles.section} aria-label="Portfolio">
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
