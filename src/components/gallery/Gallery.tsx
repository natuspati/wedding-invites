import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "@/components/gallery/Gallery.module.css";

const mediaModules = import.meta.glob("/src/assets/gallery/*.{png,mp4}", {
  eager: false,
  import: "default",
});

const items = await Promise.all(
  Object.entries(mediaModules).map(async ([path, load]) => ({
    type: path.endsWith(".mp4") ? "video" : "image",
    src: (await (load as () => Promise<string>)()) as string,
  }))
);

export default function Gallery() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (expandedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [expandedIndex]);

  const closeExpanded = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedIndex(null);
  };

  const expandedItem = expandedIndex !== null ? items[expandedIndex] : null;

  return (
    <section>
      <div className="container section-card">
        <div className={styles.grid}>
          {items.map((item, index) => (
            <div
              key={item.src}
              className={styles.mediaContainer}
              onClick={() => setExpandedIndex(index)}
            >
              {item.type === "image" ? (
                <img src={item.src} alt="" loading="lazy" />
              ) : (
                <video preload="metadata" playsInline>
                  <source src={item.src} type="video/mp4" />
                </video>
              )}
            </div>
          ))}
        </div>
      </div>

      {expandedItem &&
        createPortal(
          <div className={styles.expanded} onClick={() => closeExpanded()}>
            <button className={styles.closeBtn} onClick={closeExpanded}>
              ✕
            </button>

            <div
              className={styles.contentWrapper}
              onClick={(e) => e.stopPropagation()}
            >
              {expandedItem.type === "image" ? (
                <img
                  src={expandedItem.src}
                  alt=""
                  className={styles.expandedMedia}
                />
              ) : (
                <video
                  controls
                  autoPlay
                  playsInline
                  className={styles.expandedMedia}
                >
                  <source src={expandedItem.src} type="video/mp4" />
                </video>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
