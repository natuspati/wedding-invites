interface AppConfig {
  apiUrl: string;
  backgroundMusicVolume: number;
}

const config: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  backgroundMusicVolume: import.meta.env.VITE_BACKGROUND_MUSIC_VOLUME || 0
};

export default config;
