interface AppConfig {
  apiUrl: string;
  backgroundMusicVolume: number;
  weddingDate: string;
  adminStorageKey: string;
  adminStorageTTL: number; // in milliseconds
  adminUsername: string;
  adminPassword: string;
  sharedAlbumUrl: string;
  RSVPTablePageSize: number;
}

const config: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
  backgroundMusicVolume: import.meta.env.VITE_BACKGROUND_MUSIC_VOLUME || 0.05,
  weddingDate: import.meta.env.VITE_WEDDING_DATE || "2026-07-04",
  adminStorageKey:
    import.meta.env.VITE_ADMIN_STORAGE_KEY || "admin_auth_session",
  adminStorageTTL:
    import.meta.env.VITE_ADMIN_STORAGE_TTL || 24 * 60 * 60 * 1000, // 24h
  adminUsername: import.meta.env.VITE_ADMIN_USERNAME || "admin",
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || "admin",
  sharedAlbumUrl:
    import.meta.env.VITE_SHARED_ALBUM_URL ||
    "https://photos.app.goo.gl/BLsBqfxaoyMy2HUU9",
  RSVPTablePageSize: import.meta.env.VITE_RSVP_TABLE_PAGE_SIZE || 20,
};

export default config;
