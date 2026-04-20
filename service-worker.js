const getVersion = async () => {
  const res = await fetch("./index.html", { cache: "no-store" });
  const text = await res.text();
  const match = text.match(/app-version\" content=\"([^\"]+)\"/);
  return match ? match[1] : "v0";
};

self.addEventListener("install", event => {
  event.waitUntil(
    getVersion().then(version => {
      return caches.open(`microvaldivia-${version}`).then(cache => {
        return cache.addAll([
          "./",
          "./index.html",
          "./manifest.json"
        ]);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    getVersion().then(version =>
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(k => !k.endsWith(version))
            .map(k => caches.delete(k))
        )
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});
