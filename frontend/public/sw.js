const CACHE_NAME = 'geoumkm-v1';
const APP_SHELL_URLS = [
  '/overview',
  '/credit-scoring',
  '/portfolio-analytics',
  '/location-intelligence',
  '/umkm',
  '/clustering',
  '/policy-simulation',
  '/reports',
  '/settings',
  '/offline',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-same-origin requests
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(request));
    return;
  }

  // Network-first for API calls
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Network-first for navigation requests (HTML pages)
  // This ensures users always get the latest HTML after deploys
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/offline');
          });
        })
    );
    return;
  }

  // Cache-first for static assets (JS, CSS, images, fonts)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
