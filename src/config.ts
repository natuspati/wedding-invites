interface AppConfig {
  apiUrl: string;
  backgroundMusicVolume: number;
  weddingDate: string;
}

const config: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  backgroundMusicVolume: import.meta.env.VITE_BACKGROUND_MUSIC_VOLUME || 0.05,
  weddingDate: import.meta.env.VITE_WEDDING_DATE || "2026-07-04"
};

export default config;
