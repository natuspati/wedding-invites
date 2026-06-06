import { useState, useEffect, useRef } from "react";
import styles from "@/components/dress-code/DressCode.module.css";

const imageModules = import.meta.glob("/src/assets/dress-code/*.png", {
  eager: true,
  import: "default",
});

const images = Object.keys(imageModules)
  .sort()
  .map((path) => imageModules[path] as string);

export default function DressCode() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

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

  return (
    <section>
      <div className="container section-card">
        <h3>Дресс-код</h3>

        <p className={styles.intro}>
          Той тек жастарға арналған, үлкендер шақырылмайды.
        </p>
        <p className={styles.intro}>
          Формальды емес, ыңғайлы киім. Шілде ыстық (30°C+), жеңіл маталар
          таңдаңыз.
        </p>
        <p className={styles.introHint}>Мысалдар:</p>

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
            {images.map((src, index) => (
              <div key={src} className={styles.slide}>
                <img
                  src={src}
                  alt={`Дресс-код үлгісі ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={() =>
              scrollToIndex(Math.min(images.length - 1, activeIndex + 1))
            }
            disabled={activeIndex === images.length - 1}
            aria-label="Келесі"
          >
            ›
          </button>
        </div>
        <div className={styles.dots}>
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              onClick={() => scrollToIndex(index)}
              aria-label={`${index + 1}-үлгі`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
