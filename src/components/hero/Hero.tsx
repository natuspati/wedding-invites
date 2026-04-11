import styles from "@/components/hero/Hero.module.css";

const NAMES = ["Ақмарал", "Нурлат"];
const shuffledNames = Math.random() < 0.5 ? NAMES : [...NAMES].reverse();

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className="container section-card">
        <div className={styles.namesWrapper}>
          <p className={styles.nameTop}>{shuffledNames[0]}</p>
          <span className={styles.ampersand}>&</span>
          <p className={styles.nameBottom}>{shuffledNames[1]}</p>
        </div>

        <p className={styles.date}>4 Шілде, 2026</p>

        <hr className={styles.divider} />

        <p className={styles.subtitle}>
          Құрметті қонақтар, біздің тойымызға қош келдіңіздер!
        </p>
        <figure className={styles.quote}>
          <blockquote className={styles.quoteText}>
            Ғашықтық — адам өмірінің ең тәтті сыры.
          </blockquote>
          <figcaption className={styles.quoteAuthor}>Мұхтар Әуезов</figcaption>
        </figure>
      </div>
    </section>
  );
}
