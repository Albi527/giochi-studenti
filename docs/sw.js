const CACHE_NAME = 'giochi-educativi-v3'; // ⬆️ VERSIONE AGGIORNATA
const urlsToCache = [
    './',
    './index.html',
    './matematica.html',
    './tabelline.html',
    './games.json' // ➕ NUOVO FILE JSON
];

self.addEventListener('install', event => {
    console.log('Service Worker: Install Event v3');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache aperta:', CACHE_NAME);
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Tutti i file cachati');
                self.skipWaiting(); // Forza l'attivazione immediata
            })
            .catch(error => {
                console.error('Service Worker: Errore durante il caching:', error);
            })
    );
});

self.addEventListener('fetch', event => {
    // Gestione speciale per games.json (sempre network-first)
    if (event.request.url.includes('games.json')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    console.log('Service Worker: games.json aggiornato dalla rete');
                    // Aggiorna la cache con la nuova versione
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    return response;
                })
                .catch(() => {
                    console.log('Service Worker: games.json dalla cache (offline)');
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Strategia cache-first per tutti gli altri file
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
                        
                        // Aggiunge alla cache solo se è un file importante
                        if (shouldCache(event.request)) {
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        
                        return response;
                    })
                    .catch(() => {
                        // Fallback per pagine non trovate
                        if (event.request.destination === 'document') {
                            console.log('Service Worker: Fallback a index.html');
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker: Activate Event v3');
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
        console.log('Service Worker: Ricevuto comando SKIP_WAITING');
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_UPDATE') {
        console.log('Service Worker: Aggiornamento cache richiesto');
        // Forza l'aggiornamento della cache
        event.waitUntil(updateCache());
    }
});

// Funzione helper per decidere cosa cachare
function shouldCache(request) {
    const url = request.url;
    
    // Cacha sempre i file HTML, CSS, JS
    if (url.includes('.html') || url.includes('.css') || url.includes('.js')) {
        return true;
    }
    
    // Cacha sempre games.json
    if (url.includes('games.json')) {
        return true;
    }
    
    // Non cachare API esterne o file troppo grandi
    if (url.includes('api.') || url.includes('analytics') || url.includes('.mp4')) {
        return false;
    }
    
    return false;
}

// Funzione per aggiornare forzatamente la cache
async function updateCache() {
    try {
        const cache = await caches.open(CACHE_NAME);
        console.log('Service Worker: Aggiornamento forzato cache...');
        
        // Rimuove e ri-aggiunge tutti i file
        await Promise.all(
            urlsToCache.map(async (url) => {
                await cache.delete(url);
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response);
                    console.log('Service Worker: Aggiornato:', url);
                }
            })
        );
        
        console.log('Service Worker: Cache aggiornata completamente');
        
        // Notifica all'app che l'aggiornamento è completato
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CACHE_UPDATED',
                message: 'Cache aggiornata con successo!'
            });
        });
        
    } catch (error) {
        console.error('Service Worker: Errore durante l\'aggiornamento cache:', error);
    }
}

// Gestisce sync in background (se supportato)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered');
        event.waitUntil(updateCache());
    }
});

// Notifica quando il service worker è pronto
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker v3 attivato e pronto!');
});
