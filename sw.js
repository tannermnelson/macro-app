const CACHE_NAME = "macro-hub-2026-07-21-v8";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./app-icon.svg",
  "./assets/theme/david-goggins-bg.jpg",
  "./assets/theme/starwars.webp",
  "./assets/theme/starwars2.jpg",
  "./assets/theme/uncMascot.png",
  "./assets/desserts/casein-chocolate-pudding.webp",
  "./assets/desserts/chocolate-chip-cookie-dough-bowl.webp",
  "./assets/desserts/cookies-and-cream-protein-blondie.webp",
  "./assets/desserts/cottage-cheese-chocolate-pudding.webp",
  "./assets/desserts/double-chocolate-mug-brownie.webp",
  "./assets/desserts/fudgy-protein-brownie-bites.webp",
  "./assets/desserts/greek-yogurt-cheesecake-bowl.webp",
  "./assets/desserts/high-protein-rice-pudding.webp",
  "./assets/desserts/peanut-butter-protein-cookie.webp",
  "./assets/desserts/protein-brownie-bowl.webp",
  "./assets/desserts/protein-ice-cream-base.webp",
  "./assets/desserts/silken-tofu-mocha-mousse.webp",
  "./assets/sounds/goggins-boats.mp3",
  "./assets/sounds/lightsaber.mp3",
  "./assets/sounds/unc-band.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchAndCache = fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchAndCache;
    })
  );
});








