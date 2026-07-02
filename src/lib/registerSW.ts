/**
 * Registers the PWA service worker in production builds only.
 * The SW URL is built from import.meta.env.BASE_URL so it works under the
 * GitHub Pages base path ('/PEexam/') as well as any other base.
 */
// This project's tsconfig does not include vite/client types, so type the
// Vite-injected import.meta.env locally (assertion only; no global
// augmentation, so it cannot conflict if vite/client is wired up later).
type ViteImportMetaEnv = { readonly PROD: boolean; readonly BASE_URL: string };

export function registerSW(): void {
  const env = (import.meta as ImportMeta & { env: ViteImportMetaEnv }).env;
  if (!('serviceWorker' in navigator) || !env.PROD) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${env.BASE_URL}sw.js`)
      .then((registration) => {
        console.info('[sw] registered', registration.scope);
      })
      .catch((error) => {
        console.warn('[sw] registration failed', error);
      });
  });
}
