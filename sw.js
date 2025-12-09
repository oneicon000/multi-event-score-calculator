// Change this version whenever you deploy new updates
const CACHE_NAME = "app-cache-v10";

self.addEventListener("install", (e) => {
  self.skipWaiting(); // activate immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/index.html?v=5",   // add ?v=version to force update
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
  self.skipWaiting(); // activate immediately after install
});

// Activate new service worker and clean old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim(); // take control immediately
      console.log("[ServiceWorker] Activated and cleaned old caches");
    })()
  );
});

// Fetch handler – Cache First, then Network Fallback
self.addEventListener("fetch", (e) => {
  // Don’t cache non-GET requests or chrome-extension requests
  if (e.request.method !== "GET" || e.request.url.startsWith("chrome-extension")) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // serve from cache
      }

      // Otherwise, fetch from network and cache the new response
      return fetch(e.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return response;
        })
        .catch(() => {
          // Optionally: return a fallback page or message when offline
          return caches.match("/index.html");
        });
    })
  );
});










