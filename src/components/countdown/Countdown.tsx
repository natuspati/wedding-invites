import { useState, useEffect } from "react";
import config from "@/config";
import styles from "@/components/countdown/Countdown.module.css";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const targetDate: number = new Date(config.weddingDate).getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <section className={styles.wrapper}>
      <div className={styles.svgBackground}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#F2F4F8"
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73,41.5C64.6,53.8,53.3,63.9,40.4,71.8C27.5,79.6,13.7,85.1,-0.8,86.5C-15.3,87.9,-30.6,85.2,-44.1,78C-57.6,70.7,-69.3,58.9,-77.4,45.1C-85.5,31.3,-90.1,15.6,-88.5,0.9C-86.9,-13.8,-79.2,-27.6,-69.9,-39.9C-60.6,-52.2,-49.7,-63,-37.1,-71.1C-24.5,-79.2,-12.3,-84.5,1.2,-86.7C14.8,-88.8,29.6,-83.7,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>Тойға дейін:</h3>
        <div className={styles.timerGrid}>
          <div className={styles.timeBox}>
            <span>{timeLeft.days}</span>
            <p>күн</p>
          </div>
          <div className={styles.timeBox}>
            <span>{timeLeft.hours}</span>
            <p>сағат</p>
          </div>
          <div className={styles.timeBox}>
            <span>{timeLeft.minutes}</span>
            <p>минут</p>
          </div>
          <div className={styles.timeBox}>
            <span>{timeLeft.seconds}</span>
            <p>секунд</p>
          </div>
        </div>
      </div>
    </section>
  );
}
