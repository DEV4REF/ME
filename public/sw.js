// Service worker for Aaref | عارف portfolio.
// Registered with a relative URL, so `self.registration.scope` automatically
// resolves to the correct base path whether the site is hosted at the
// domain root or under a GitHub Pages subpath (e.g. /ME/).

const CACHE_VERSION = "v1";
const CACHE_NAME = `aaref-cache-${CACHE_VERSION}`;

// Resolve all app-shell URLs relative to the SW's own scope.
const SCOPE = self.registration ? self.registration.scope : self.location.href;
const APP_SHELL = [
  "",
  "offline.html",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
].map((p) => new URL(p, SCOPE).toString());

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("aaref-cache-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle same-origin GET requests. Cross-origin calls (e.g. the
  // GitHub API used to fetch live repos) are left untouched.
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // Navigation requests: network-first, falling back to cache, then offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(
          () =>
            caches.match(request).then(
              (cached) => cached || caches.match(new URL("offline.html", SCOPE).toString())
            )
        )
    );
    return;
  }

  // Static assets: cache-first, update cache in background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
