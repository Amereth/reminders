/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SUPABASE_PUBLIC_KEY: string
  readonly VITE_SUPABASE_PROJECT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
