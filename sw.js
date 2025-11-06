// Configuración del Service Worker
const CACHE_NAME = 'camara-pwa-v2';

// Lista de archivos a guardar en caché (rutas relativas)
const urlsToCache = [
    './',
    './index.html',
    './app.js',
    './manifest.json',
    './192.png',
    './512.png'
];

// INSTALL - Guardar archivos en caché
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto:', CACHE_NAME);
                return cache.addAll(urlsToCache);
            })
            .then(() => console.log('Archivos cacheados correctamente'))
            .catch(err => console.error('Error al cachear:', err))
    );
});

// FETCH - Prioridad a caché, luego a red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                console.log('Desde caché:', event.request.url);
                return cachedResponse;
            }
            console.log('Desde red:', event.request.url);
            return fetch(event.request);
        })
    );
});

// ACTIVATE - Eliminar cachés viejos
self.addEventListener('activate', event => {
    console.log('Service Worker: Activando...');

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando caché viejo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

console.log('Service Worker cargado');
