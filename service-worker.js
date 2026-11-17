
const CACHE_NAME = 'dawood-finance-v1';

const APP_FILES = [
  '/family-finance-pwa/',
  '/family-finance-pwa/index.html',
  '/family-finance-pwa/manifest.json',
  '/family-finance-pwa/icon-192.png',
  '/family-finance-pwa/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Jangan cache permintaan API atau Google OAuth.
  if (url.origin !== self.location.origin) return;

  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});
