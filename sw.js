// Change this version whenever you deploy new updates
const CACHE_NAME = "app-cache-v4";

self.addEventListener("install", (e) => {
  self.skipWaiting(); // activate immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./data.js", 
        "./manifest.json", 
        "./maskable_icon_192x192.png",
        "./maskable_icon_512x512.png",
        "./icon-192.png",
        "./icon-512.png",
      ]);
    })
  );
});

// Remove old caches when activating new service worker
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim(); // new SW takes control immediately
});

// Fetch from cache, fall back to network if not cached
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});



