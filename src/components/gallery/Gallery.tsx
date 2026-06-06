import { useState, useEffect, useRef } from "react";
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
    const posterPath = path.replace(".mp4", ".poster.jpg");
    const src = (await (
      videoModules[path] as () => Promise<string>
    )()) as string;
    const poster =
      posterPath in posterModules
        ? ((await (
            posterModules[posterPath] as () => Promise<string>
          )()) as string)
        : undefined;
    return { type: "video" as const, src, poster };
  }),
]);

export default function Gallery() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = expandedIndex !== null ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [expandedIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = slides.indexOf(entry.target as HTMLElement);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { root: track, threshold: [0.6] }
    );
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }
  };

  const closeExpanded = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedIndex(null);
  };

  const expandedItem = expandedIndex !== null ? items[expandedIndex] : null;

  return (
    <section>
      <div className="container section-card">
        <div className={styles.carousel}>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            aria-label="Алдыңғы"
          >
            ‹
          </button>
          <div ref={trackRef} className={styles.track}>
            {items.map((item, index) => (
              <div
                key={item.src}
                className={styles.slide}
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
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={() =>
              scrollToIndex(Math.min(items.length - 1, activeIndex + 1))
            }
            disabled={activeIndex === items.length - 1}
            aria-label="Келесі"
          >
            ›
          </button>
        </div>
        <div className={styles.dots}>
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              onClick={() => scrollToIndex(index)}
              aria-label={`${index + 1}-сурет`}
            />
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
