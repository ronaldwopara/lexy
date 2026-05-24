import Image from "next/image";
import HeroHeadline from "@/components/HeroHeadline";
import HeroLogo from "@/components/HeroLogo";
import HeroOrderButton from "@/components/HeroOrderButton";
import HeroScrollProvider from "@/components/HeroScrollProvider";
import PortfolioTicker from "@/components/PortfolioTicker";
import VideoSwiper from "@/components/VideoSwiper";
import { HERO_VIDEOS } from "@/lib/hero-videos";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <div className={styles.hero} data-hero-scroll>
        <HeroScrollProvider>
          <div className={styles.heroSticky}>
            <header className={styles.header}>
              <div className={styles.logoRow}>
                <HeroLogo />
                <a
                  href="#cart"
                  className={`${styles.cart} ${styles.cartMobile}`}
                  aria-label="Cart"
                >
                  <Image
                    src="/cart.svg"
                    alt=""
                    width={32}
                    height={32}
                    className={styles.cartIcon}
                  />
                </a>
              </div>
              <nav className={styles.nav}>
                <a href="#process">Process</a>
                <a href="#menu">Menu</a>
                <a href="#testimonials">Testimonials</a>
                <a href="#contact">Contact</a>
                <a
                  href="#cart"
                  className={`${styles.cart} ${styles.cartDesktop}`}
                  aria-label="Cart"
                >
                  <Image
                    src="/cart.svg"
                    alt=""
                    width={32}
                    height={32}
                    className={styles.cartIcon}
                  />
                </a>
              </nav>
            </header>

            <main className={styles.content}>
              <HeroHeadline />

              <div className={styles.swiperArea}>
                <VideoSwiper videos={HERO_VIDEOS} />
              </div>

              <div className={styles.cta}>
                <HeroOrderButton />
              </div>
            </main>
          </div>
        </HeroScrollProvider>
      </div>
      <div className={styles.scrollRelease} aria-hidden />
      <PortfolioTicker />
    </>
  );
}
