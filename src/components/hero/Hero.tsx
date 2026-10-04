import styles from "@/components/hero/Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className="container section-card">
        <div className={styles.namesWrapper}>
          <p className={styles.nameTop}>Azat</p>
          <span className={styles.ampersand}>&</span>
          <p className={styles.nameBottom}>Madina</p>
        </div>

        <p className={styles.date}>7 қараша, 2026</p>

        <hr className={styles.divider} />

        <p className={styles.subtitle}>
          Құрметті қонақтар, біздің тойымызға қош келдіңіздер!
        </p>
        <figure className={styles.quote}>
          <blockquote className={styles.quoteText}>
            Махаббат диалогы - екі жүректің әңгімесі.
          </blockquote>
          <figcaption className={styles.quoteAuthor}>
            Мұқағали Мақатаев
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
