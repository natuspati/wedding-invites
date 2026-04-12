import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "@/components/gallery/Gallery.module.css";

const posterModules = import.meta.glob("/src/assets/gallery/*.poster.jpg", {
  eager: false,
  import: "default",
});
const imageModules = import.meta.glob("/src/assets/gallery/*.webp", {
  eager: false,
  import: "default",
});
const videoModules = import.meta.glob("/src/assets/gallery/*.mp4", {
  eager: false,
  import: "default",
});

const imagePaths = Object.keys(imageModules);

const items = await Promise.all([
  ...imagePaths.map(async (path) => ({
    type: "image" as const,
    src: (await (imageModules[path] as () => Promise<string>)()) as string,
  })),
  ...Object.keys(videoModules).map(async (path) => {
    const posterPath = path.replace(".mp4", ".poster.jpg"); // ← .jpg not .webp
    const src = (await (
      videoModules[path] as () => Promise<string>
    )()) as string;
    const poster =
      posterPath in posterModules // ← check posterModules not imageModules
        ? ((await (
            posterModules[posterPath] as () => Promise<string>
          )()) as string)
        : undefined;
    return { type: "video" as const, src, poster };
  }),
]);

export default function Gallery() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = expandedIndex !== null ? "hidden" : "unset";
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
                <video preload="none" playsInline poster={item.poster}>
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
