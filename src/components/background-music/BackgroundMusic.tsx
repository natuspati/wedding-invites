import { useEffect, useRef, useState } from "react";
import config from "@/config";
import styles from "./BackgroundMusic.module.css";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    import("@/assets/background.mp3").then(({ default: src }) => {
      audio.src = src;
      audio.volume = config.backgroundMusicVolume;
      audio.play().catch(() => {
        const resume = () => {
          audio.play();
          document.removeEventListener("click", resume);
        };
        document.addEventListener("click", resume);
      });
    });
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted((prev) => !prev);
  };

  return (
    <>
      <audio ref={audioRef} loop preload="none" />

      <button
        className={styles.muteButton}
        onClick={toggleMute}
        aria-label={muted ? "Unmute music" : "Mute music"}
      >
        {muted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </>
  );
}
