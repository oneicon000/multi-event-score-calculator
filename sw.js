self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("app-cache").then((cache) => {
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
      ]).catch((err) => {
        console.warn("SW cache failed:", err);
      });
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
