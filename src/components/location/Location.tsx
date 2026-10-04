import styles from "@/components/location/Location.module.css";

export default function Location() {
  return (
    <section>
      <div className="container section-card">
        <h3>Shatush</h3>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📍</span>
            <span>Қорғалжын тас жолы, 13, 3 қабат</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>🕔</span>
            <span>7 қараша, 2026 · 17:00</span>
          </div>
        </div>

        <a
          href="https://go.2gis.com/iSmZU"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.directionsLink}
        >
          2GIS-та ашу →
        </a>

        <div className={styles.mapWrapper}>
          <iframe
            src="https://yandex.com/map-widget/v1/?um=constructor%3A1b0c83d93cbb16cd55bb202c384a0ee38253baabbd20e1848b1b128b18cee978&source=constructor"
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
