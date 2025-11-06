// Configuración del Service Worker
const CACHE_NAME = "camara-pwa-v1";

// Lista de archivos a guardar en caché
const urlsToCache = ["/", "/index.html", "/app.js", "/manifest.json"];

// Evento INSTALL - Almacenamiento inicial
self.addEventListener("install", function (event) {
  console.log("Service Worker: Instalando...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        console.log("Cache abierto:", CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(function () {
        console.log("Archivos cacheados correctamente");
      })
      .catch(function (error) {
        console.error("Error al cachear archivos:", error);
      })
  );
});

// Evento FETCH - Estrategia Cache First
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function (response) {
        if (response) {
          console.log("Sirviendo desde caché:", event.request.url);
          return response;
        }

        console.log("Obteniendo desde red:", event.request.url);
        return fetch(event.request);
      })
      .catch(function (error) {
        console.error("Error en fetch:", error);
      })
  );
});

// Evento ACTIVATE - Limpieza de cachés antiguos
self.addEventListener("activate", function (event) {
  console.log("Service Worker: Activando...");

  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log("Eliminando caché antiguo:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function () {
        console.log("Service Worker activado correctamente");
        return self.clients.claim();
      })
  );
});

console.log("Service Worker cargado");
