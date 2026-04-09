import { useEffect, useRef } from "react";
import config from "@/config";
import backgroundMusic from "@/assets/background.mp3";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = config.backgroundMusicVolume;
    }

    const playMusic = () => {
      audioRef.current?.play();
      document.removeEventListener("click", playMusic);
    };

    document.addEventListener("click", playMusic);

    return () => {
      document.removeEventListener("click", playMusic);
    };
  }, []);

  return (
    <audio ref={audioRef} loop>
      <source src={backgroundMusic} type="audio/mpeg" />
    </audio>
  );
}
