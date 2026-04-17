/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

/** Variáveis expostas via import.meta.env (prefixo VITE_ ou uso em SSR conforme doc Astro) */
interface ImportMetaEnv {
  readonly OPENAI_API_KEY: string
  readonly OPENAI_MODEL?: string
}
