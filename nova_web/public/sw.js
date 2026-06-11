/* NOVA OFFICIAL service worker — offline-first shell caching. */
const CACHE_NAME = "nova-cache-v1";
const OFFLINE_URL = "/offline";

const PRECACHE = [
  OFFLINE_URL,
  "/icons/icon-512.svg",
  "/icons/icon-maskable-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Navigations: network first, offline page as fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then((r) => r ?? Response.error())
      )
    );
    return;
  }

  // Static assets: cache first, then network (and cache the result).
  const url = new URL(request.url);
  const isStatic =
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/icons/") ||
      url.pathname.startsWith("/products/") ||
      url.pathname.startsWith("/_next/static/"));

  if (isStatic) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
      )
    );
  }
});
