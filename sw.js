// babyFAQ Service Worker
// Cache-first strategy: funciona sin internet después de la primera visita

const CACHE_NAME = 'babyfaq-v1';

// Todos los recursos a cachear (las herramientas funcionan 100% offline)
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/tomas-leche.html',
  '/calculadora-lactancia.html',
  '/alimentos-edad.html',
  '/percentil.html',
  '/talla-zapato.html',
  '/tallas-ropa.html',
  '/sueno-bebe.html',
  '/checker-productos.html',
  '/sugerir.html',
  '/favicon.svg',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
];

// ── Install: pre-cachear todos los assets ────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: limpiar caches antiguos ────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first, network fallback ─────────────────────────
self.addEventListener('fetch', event => {
  // Solo interceptar GET requests del mismo origen o Google Fonts
  const url = new URL(event.request.url);
  const isOwnOrigin = url.origin === self.location.origin;
  const isGoogleFonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

  if (!isOwnOrigin && !isGoogleFonts) return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;

        // No está en cache → ir a red y cachear para la próxima
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            const toCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, toCache));
            return response;
          })
          .catch(() => {
            // Sin red y no estaba cacheado → página offline básica
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});
