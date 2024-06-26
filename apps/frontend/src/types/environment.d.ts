declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_BASE_URL: string;
      NEXT_PUBLIC_API_BASE_URL: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
