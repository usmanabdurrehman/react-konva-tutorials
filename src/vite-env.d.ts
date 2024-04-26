/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOW_MOVE_BUTTONS: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
