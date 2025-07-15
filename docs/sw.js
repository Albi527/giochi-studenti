const CACHE_NAME = 'giochi-educativi-v1';
const urlsToCache = [
    './',
    './index.html',
    './matematica.html',
    './tabelline.html'
];

self.addEventListener('install', event => {
    console.log('Service Worker: Install Event');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache aperta');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Tutti i file cachati');
                self.skipWaiting();
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Ritorna dalla cache se disponibile
                if (response) {
                    console.log('Service Worker: Serving from cache:', event.request.url);
                    return response;
                }
                
                // Altrimenti fetch dalla rete
                console.log('Service Worker: Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then(response => {
                        // Controlla se è una risposta valida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clona la risposta
                        const responseToCache = response.clone();
                        
                        // Aggiunge alla cache
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // Fallback per pagine non trovate
                        if (event.request.destination === 'document') {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker: Activate Event');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando cache vecchia:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Ora controlla tutte le pagine');
            return self.clients.claim();
        })
    );
});

// Gestisce messaggi dall'app principale
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
