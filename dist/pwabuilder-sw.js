
const CACHE = "pwabuilder-offline-V32"; // Incrementar a versão do cache

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "ACTIVATE_NEW_SW") {
    self.skipWaiting();
    self.clients.claim(); 
  }
});


workbox.routing.registerRoute(
  new RegExp('^https://pga.cigel.com.br:8095/'),
  new workbox.strategies.NetworkOnly()
);

workbox.routing.registerRoute(
  new RegExp('^https://localhost:8095/'),
  new workbox.strategies.NetworkOnly()
);

workbox.routing.registerRoute(
  new RegExp('^http://10.0.0.158:8091/'),
  new workbox.strategies.NetworkOnly()
);

 workbox.routing.registerRoute(
   new RegExp('.*'),
   new workbox.strategies.NetworkFirst({
     cacheName: CACHE,
   })
 );

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Recarregar a página quando o novo Service Worker for ativado.
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "NEW_VERSION_ACTIVATED" });
    });
  });
});
