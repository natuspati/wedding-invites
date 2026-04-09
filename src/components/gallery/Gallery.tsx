import { useState } from "react";
import styles from "@/components/gallery/Gallery.module.css";

const mediaModules = import.meta.glob("/src/assets/gallery/*.{png,mp4}", {
  eager: true,
  import: "default",
});

const items = Object.entries(mediaModules).map(([path, url]) => ({
  type: path.endsWith(".mp4") ? "video" : "image",
  src: url as string,
}));

export default function Gallery() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const closeExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIndex(null);
  };

  return (
    <section>
      <div className="container section-card">
        <div className={styles.grid}>
          {items.map((item, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={item.src}
                className={`${styles.mediaContainer} ${isExpanded ? styles.expanded : ""}`}
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                {isExpanded && (
                  <button className={styles.closeBtn} onClick={closeExpanded}>
                    ✕
                  </button>
                )}

                {item.type === "image" ? (
                  <img src={item.src} alt="" loading="lazy" />
                ) : (
                  <video
                    controls={isExpanded}
                    preload="metadata"
                    playsInline
                    onClick={(e) => isExpanded && e.stopPropagation()}
                  >
                    <source src={item.src} type="video/mp4" />
                  </video>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}