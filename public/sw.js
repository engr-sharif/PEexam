/* Service worker for CA PE Civil Prep.
 * Strategy: no precache; stale-while-revalidate for same-origin GETs at
 * runtime, with offline fallback to cache (and to cached './index.html' for
 * navigations). All URLs are relative to the SW scope so the GitHub Pages
 * base path ('/PEexam/') works without hardcoding.
 */
const CACHE_NAME = 'pe-prep-v1';
const INDEX_URL = './index.html';

self.addEventListener('install', () => {
  // Precache nothing; the app shell is cached at runtime on first load.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(staleWhileRevalidate(event, request));
});

async function staleWhileRevalidate(event, request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
        // Keep a copy of the app shell under a stable relative key so
        // navigations to any route can fall back to it offline.
        if (request.mode === 'navigate') {
          cache.put(INDEX_URL, response.clone());
        }
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    // Serve the cached copy immediately; refresh it in the background.
    event.waitUntil(network.then(() => undefined));
    return cached;
  }

  const fresh = await network;
  if (fresh) return fresh;

  // Offline with nothing cached for this exact request: for navigations,
  // fall back to the cached app shell.
  if (request.mode === 'navigate') {
    const shell = await cache.match(INDEX_URL);
    if (shell) return shell;
  }
  return Response.error();
}
