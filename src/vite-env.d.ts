/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOME_INSURANCE_API: string
  readonly VITE_CAR_INSURANCE_API: string
  readonly VITE_BASE_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
