const CACHE_NAME = 'giochi-educativi-v4'; // ⬆️ VERSIONE AGGIORNATA per matematica 3.0.0
const urlsToCache = [
    './',
    './index.html',
    './matematica.html',        // ✅ Matematica 3.0.0 con divisioni ÷10,÷100,÷1000 e sfondo verde menta
    './tabelline.html',
    './games.json'              // ✅ JSON aggiornato con 6 operazioni e 33 livelli
];

self.addEventListener('install', event => {
    console.log('Service Worker: Install Event v4 - Matematica 3.0.0');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache aperta:', CACHE_NAME);
                console.log('Service Worker: Caching matematica.html v3.0.0 con:');
                console.log('  - 6 tipi di operazioni (era 4)');
                console.log('  - 33 livelli totali (era 22)');
                console.log('  - Divisioni per 10/100/1000 (7 livelli)');
                console.log('  - Sfondo verde menta fresco');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Tutti i file v4 cachati con successo');
                self.skipWaiting(); // Forza l'attivazione immediata
            })
            .catch(error => {
                console.error('Service Worker: Errore durante il caching v4:', error);
            })
    );
});

self.addEventListener('fetch', event => {
    // Gestione speciale per games.json (sempre network-first per aggiornamenti)
    if (event.request.url.includes('games.json')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    console.log('Service Worker: games.json v1.3.0 aggiornato dalla rete');
                    console.log('  - Nuove stats: 6 operazioni, 33 livelli');
                    console.log('  - Descrizione aggiornata con divisioni ÷10,÷100,÷1000');
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

    // Gestione speciale per matematica.html (forza aggiornamento per v3.0.0)
    if (event.request.url.includes('matematica.html')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    // Controlla se abbiamo la versione cached
                    if (response) {
                        console.log('Service Worker: matematica.html v3.0.0 dalla cache');
                        // Tenta aggiornamento in background per futuri utilizzi
                        fetch(event.request)
                            .then(networkResponse => {
                                if (networkResponse && networkResponse.status === 200) {
                                    caches.open(CACHE_NAME)
                                        .then(cache => {
                                            cache.put(event.request, networkResponse.clone());
                                        });
                                }
                            })
                            .catch(() => {
                                // Ignora errori di rete per aggiornamenti background
                            });
                        return response;
                    }
                    
                    // Se non in cache, fetch dalla rete
                    console.log('Service Worker: matematica.html v3.0.0 dalla rete');
                    return fetch(event.request)
                        .then(networkResponse => {
                            if (networkResponse && networkResponse.status === 200) {
                                const responseToCache = networkResponse.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => {
                                        cache.put(event.request, responseToCache);
                                    });
                            }
                            return networkResponse;
                        });
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
                    console.log('Service Worker: Serving from cache v4:', event.request.url);
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
    console.log('Service Worker: Activate Event v4 - Matematica 3.0.0');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando cache vecchia:', cacheName);
                        console.log('  - Aggiornando a v4 con nuove funzionalità matematica');
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Ora controlla tutte le pagine con v4');
            console.log('🎯 Nuove funzionalità disponibili:');
            console.log('  ✅ Divisioni ÷10, ÷100, ÷1000 (7 livelli)');
            console.log('  ✅ 6 tipi di operazioni complete');
            console.log('  ✅ 33 livelli totali di gioco');
            console.log('  ✅ Sfondo verde menta rilassante');
            console.log('  ✅ Menu espandibili moltiplicazioni/divisioni');
            return self.clients.claim();
        })
    );
});

// Gestisce messaggi dall'app principale
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('Service Worker: Ricevuto comando SKIP_WAITING per v4');
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_UPDATE') {
        console.log('Service Worker: Aggiornamento cache v4 richiesto');
        // Forza l'aggiornamento della cache
        event.waitUntil(updateCache());
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        console.log('Service Worker: Richiesta versione corrente');
        event.ports[0].postMessage({
            version: 'v4',
            matematicaVersion: '3.0.0',
            features: [
                'Divisioni ÷10, ÷100, ÷1000',
                'Sfondo verde menta',
                '6 operazioni complete',
                '33 livelli totali'
            ]
        });
    }
});

// Funzione helper per decidere cosa cachare
function shouldCache(request) {
    const url = request.url;
    
    // Cacha sempre i file HTML, CSS, JS principali
    if (url.includes('.html') || url.includes('.css') || url.includes('.js')) {
        return true;
    }
    
    // Cacha sempre games.json
    if (url.includes('games.json')) {
        return true;
    }
    
    // Cacha manifest e icone PWA
    if (url.includes('manifest') || url.includes('icon')) {
        return true;
    }
    
    // Non cachare API esterne o file troppo grandi
    if (url.includes('api.') || url.includes('analytics') || url.includes('.mp4') || url.includes('.zip')) {
        return false;
    }
    
    return false;
}

// Funzione per aggiornare forzatamente la cache
async function updateCache() {
    try {
        const cache = await caches.open(CACHE_NAME);
        console.log('Service Worker: Aggiornamento forzato cache v4...');
        
        // Rimuove e ri-aggiunge tutti i file
        await Promise.all(
            urlsToCache.map(async (url) => {
                await cache.delete(url);
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response);
                    console.log('Service Worker: Aggiornato v4:', url);
                }
            })
        );
        
        console.log('Service Worker: Cache v4 aggiornata completamente');
        console.log('🎉 Matematica 3.0.0 pronta con tutte le nuove funzionalità!');
        
        // Notifica all'app che l'aggiornamento è completato
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CACHE_UPDATED',
                version: 'v4',
                message: 'Cache aggiornata con successo! Matematica 3.0.0 disponibile.',
                newFeatures: [
                    'Divisioni ÷10, ÷100, ÷1000 (7 livelli)',
                    'Sfondo verde menta rilassante',
                    '6 operazioni complete (33 livelli totali)',
                    'Menu espandibili migliorati'
                ]
            });
        });
        
    } catch (error) {
        console.error('Service Worker: Errore durante aggiornamento cache v4:', error);
    }
}

// Gestisce sync in background (se supportato)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered per v4');
        event.waitUntil(updateCache());
    }
});

// Gestione notifiche push (preparazione futura)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        console.log('Service Worker: Push notification ricevuta:', data);
        
        // Notifica per nuove funzionalità
        if (data.type === 'new_features') {
            event.waitUntil(
                self.registration.showNotification('🎮 Giochi Educativi', {
                    body: data.message || 'Nuove funzionalità disponibili in Matematica sul Divano!',
                    icon: '/icon-192.png',
                    badge: '/badge-72.png',
                    tag: 'matematica-update',
                    actions: [
                        {
                            action: 'open',
                            title: '🚀 Prova Ora'
                        }
                    ]
                })
            );
        }
    }
});

// Gestione click notifiche
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification click ricevuto:', event);
    
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('./matematica.html')
        );
    }
});

// Notifica quando il service worker v4 è pronto
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker v4 attivato e pronto!');
    console.log('📚 Matematica sul Divano 3.0.0 con divisioni complete disponibile!');
});
