import styles from "@/components/location/Location.module.css";

export default function Location() {
  return (
    <section>
      <div className="container section-card">
        <h3>Koktal Resort</h3>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📍</span>
            <span>Еңлік-Кебек көшесі, 1/6, Астана, Қазақстан</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>🕔</span>
            <span>4 Шілде, 2026 · 16:00</span>
          </div>
        </div>

        <a
          href="https://go.2gis.com/sNmq0"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.directionsLink}
        >
          2GIS-та ашу →
        </a>

        <div className={styles.mapWrapper}>
          <iframe
            src="https://yandex.com/map-widget/v1/?um=constructor%3A682d0dd36d2d305c861cad2e299831e0e527fd537038248e07879aaa165de9bb&amp;source=constructor"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title="Location Map"
          />
        </div>
      </div>
    </section>
  );
}