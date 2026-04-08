import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className="container section-card">
        <h1>Ақмарал мен Нурлат</h1>
        <p className={styles.date}>4 Шілде, 2026</p>
        <p className={`${styles.date} ${styles.quote}`}>Ғашықтық - адам өмірінің ең тәтті сыры. Мұхтар Әуезов</p>
      </div>
    </section>
  );
}