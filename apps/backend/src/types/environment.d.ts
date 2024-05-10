declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: string;
      SPOTIFY_CLIENT_ID: string;
      SPOTIFY_CLIENT_SECRET: string;
      BACKEND_ORIGIN_URL: string;
      APP_ORIGIN_URL: string;
      CORS_ORIGINS: string;
    }
  }
}

export {};
