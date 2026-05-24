import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.hero}>
      {/* Video Background */}
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        poster="/poster.jpg"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay */}
      <div className={styles.overlay} />

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
        
        <div className={styles.cta}>
          <p className={styles.subtext}>
            <span className={styles.subtextLine}>We are only accepting</span>
            <span className={styles.subtextLine}>Scheduled Order</span>
          </p>
          <a href="#order" className={styles.button}>
            <span>Order Now</span>
          </a>
        </div>
      </main>
    </div>
  );
}
