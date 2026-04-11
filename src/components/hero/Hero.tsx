import styles from "@/components/hero/Hero.module.css";

const NAMES = ["Ақмарал", "Нурлат"];
const shuffledNames = Math.random() < 0.5 ? NAMES : [...NAMES].reverse();

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className="container section-card">
        <h1>{shuffledNames.join(" & ")}</h1>
        <p className={styles.date}>4 Шілде, 2026</p>
        <p>Құрметті қонақтар, біздің тойымызға қош келдіңіздер!</p>
        <p className={`${styles.date} ${styles.quote}`}>
          Ғашықтық - адам өмірінің ең тәтті сыры. Мұхтар Әуезов
        </p>
      </div>
    </section>
  );
}
