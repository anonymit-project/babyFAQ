// babyFAQ Service Worker
// Cache-first con actualización en background

const CACHE_NAME = 'babyfaq-v2';

// Páginas y assets a precachear en la instalación
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/dosis-fiebre.html',
  '/tomas-leche.html',
  '/alimentos-edad.html',
  '/percentil.html',
  '/talla-zapato.html',
  '/tallas-ropa.html',
  '/sueno-bebe.html',
  '/checker-productos.html',
  '/calculadora-lactancia.html',
  '/sugerir.html',
  '/favicon.svg',
  '/manifest.json',
];

// ── Install: precachear todo ──────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: limpiar caches antiguas ─────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first, fallback a red, luego index offline ───────
self.addEventListener('fetch', event => {
  // Solo GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isSameOrigin  = url.origin === self.location.origin;
  const isGoogleFont  = url.hostname.includes('fonts.googleapis.com') ||
                        url.hostname.includes('fonts.gstatic.com');
  const isGoogleTag   = url.hostname.includes('googletagmanager.com') ||
                        url.hostname.includes('google-analytics.com');

  // No interceptar analytics (no bloquear si falla)
  if (isGoogleTag) return;

  // Solo interceptar mismo origen + fuentes Google
  if (!isSameOrigin && !isGoogleFont) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cachedResponse => {
        // Revalidar en background (stale-while-revalidate)
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => null);

        // Devolver cache inmediatamente si existe
        if (cachedResponse) return cachedResponse;

        // Si no hay cache, esperar a red
        return fetchPromise.then(networkResponse => {
          if (networkResponse) return networkResponse;
          // Fallback offline: devolver index para páginas HTML
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return cache.match('/index.html');
          }
          return new Response('', { status: 408, statusText: 'Sin conexión' });
        });
      })
    )
  );
});
