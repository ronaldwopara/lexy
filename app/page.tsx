import Image from "next/image";
import VideoSwiper from "@/components/VideoSwiper";
import { HERO_VIDEOS } from "@/lib/hero-videos";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
    <div className={styles.hero} data-hero-scroll>
      <div className={styles.heroSticky}>
      {/* Navigation */}
      <header className={styles.header}>
        <div className={styles.logoRow}>
          <a href="/" className={styles.logo}>
            Lexy's Kitchen
          </a>
          <a href="#cart" className={`${styles.cart} ${styles.cartMobile}`} aria-label="Cart">
            <Image src="/cart.svg" alt="" width={32} height={32} className={styles.cartIcon} />
          </a>
        </div>
        <nav className={styles.nav}>
          <a href="#process">Process</a>
          <a href="#menu">Menu</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
          <a href="#cart" className={`${styles.cart} ${styles.cartDesktop}`} aria-label="Cart">
            <Image src="/cart.svg" alt="" width={32} height={32} className={styles.cartIcon} />
          </a>
        </nav>
      </header>

      {/* Hero Content */}
      <main className={styles.content}>
        <h1 className={styles.headline}>
          Soul Food,
          <br />
          Cakes and
          <br />
          Catering
        </h1>

        <div className={styles.swiperArea}>
          <VideoSwiper videos={HERO_VIDEOS} />
        </div>

        <div className={styles.cta}>
          <p className={styles.subtext}>
            <span className={styles.subtextLine}>We are only accepting</span>
            <span className={styles.subtextLine}>Scheduled Orders</span>
          </p>
          <a href="#order" className={styles.button} aria-label="Order Now">
            <span className={styles.buttonWord}>Order</span>
            <span className={styles.buttonRule} aria-hidden />
            <span className={styles.buttonWord}>Now</span>
          </a>
        </div>
      </main>
      </div>
    </div>
    <div className={styles.scrollRelease} aria-hidden />
    </>
  );
}
