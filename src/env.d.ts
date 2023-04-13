/// <reference types="vite/client" />

interface ImportMetaEnv {
  // more env variables...
  readonly VITE_SERVER_URL: string;
  readonly VITE_BACKEND_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
