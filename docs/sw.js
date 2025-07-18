const CACHE_NAME = 'giochi-educativi-v6'; // ⬆️ VERSIONE FINALE con installazione persistente
const urlsToCache = [
    './',
    './index.html',                // ✅ Landing page finale con installazione smart persistente
    './matematica.html',           // ✅ Matematica 3.0.0 con 6 operazioni e 33 livelli
    './tabelline.html',           // ✅ Sfida Tabelline con timer 60s e 3 livelli
    './games.json',               // ✅ JSON con stats finali (2 disponibili, 1 in sviluppo)
    './manifest.json',            // ✅ PWA manifest per installazione
    './icon-192.png',             // ✅ Icone PWA
    './icon-512.png'
];

self.addEventListener('install', event => {
    console.log('Service Worker: Install Event v6 - Versione Finale');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache aperta:', CACHE_NAME);
                console.log('Service Worker: Versione finale con:');
                console.log('  - 🎮 Landing page con installazione smart persistente');
                console.log('  - 🤖 Card installazione che scompare permanentemente');
                console.log('  - 🧮 Matematica sul Divano (6 operazioni, 33 livelli)');
                console.log('  - 🎯 Sfida Tabelline (timer 60s, 3 livelli)');
                console.log('  - 📱 Istruzioni Android corrette (tre trattini)');
                console.log('  - 💾 Persistenza installazione con localStorage');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Tutti i file v6 cachati con successo');
                self.skipWaiting(); // Forza l'attivazione immediata
            })
            .catch(error => {
                console.error('Service Worker: Errore durante il caching v6:', error);
            })
    );
});

self.addEventListener('fetch', event => {
    // Gestione speciale per index.html (sempre aggiornata per nuove funzionalità)
    if (event.request.url.includes('index.html') || event.request.url.endsWith('/')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    // Serve dalla cache se disponibile
                    if (response) {
                        console.log('Service Worker: index.html v6 dalla cache');
                        // Aggiornamento background per future visite
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
                    console.log('Service Worker: index.html v6 dalla rete');
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

    // Gestione speciale per games.json (sempre network-first per stats aggiornate)
    if (event.request.url.includes('games.json')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    console.log('Service Worker: games.json v1.5.0 aggiornato dalla rete');
                    console.log('  - Stats finali: 2 giochi disponibili, 1 in sviluppo');
                    console.log('  - Matematica: 6 operazioni, 33 livelli');
                    console.log('  - Tabelline: timer 60s, 3 livelli');
                    console.log('  - Installazione: persistente con localStorage');
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

    // Gestione speciale per matematica.html (cache-first con background update)
    if (event.request.url.includes('matematica.html')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        console.log('Service Worker: matematica.html v3.0.0 dalla cache');
                        // Background update
                        fetch(event.request)
                            .then(networkResponse => {
                                if (networkResponse && networkResponse.status === 200) {
                                    caches.open(CACHE_NAME)
                                        .then(cache => {
                                            cache.put(event.request, networkResponse.clone());
                                        });
                                }
                            })
                            .catch(() => {});
                        return response;
                    }
                    
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

    // Gestione speciale per tabelline.html (cache-first con background update)
    if (event.request.url.includes('tabelline.html')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        console.log('Service Worker: tabelline.html dalla cache');
                        // Background update
                        fetch(event.request)
                            .then(networkResponse => {
                                if (networkResponse && networkResponse.status === 200) {
                                    caches.open(CACHE_NAME)
                                        .then(cache => {
                                            cache.put(event.request, networkResponse.clone());
                                        });
                                }
                            })
                            .catch(() => {});
                        return response;
                    }
                    
                    console.log('Service Worker: tabelline.html dalla rete');
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
                if (response) {
                    console.log('Service Worker: Serving from cache v6:', event.request.url.split('/').pop());
                    return response;
                }
                
                console.log('Service Worker: Fetching from network:', event.request.url.split('/').pop());
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        
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
    console.log('Service Worker: Activate Event v6 - Versione Finale');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando cache vecchia:', cacheName);
                        console.log('  - Aggiornando a v6 con installazione persistente');
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Ora controlla tutte le pagine con v6');
            console.log('🎮 Piattaforma finale pronta:');
            console.log('  ✅ Landing page con installazione smart persistente');
            console.log('  ✅ Card installazione che scompare permanentemente');
            console.log('  ✅ Matematica sul Divano (6 operazioni, 33 livelli)');
            console.log('  ✅ Sfida Tabelline (timer 60s, 3 livelli)');
            console.log('  ✅ Istruzioni Android corrette (tre trattini)');
            console.log('  ✅ PWA installabile con persistenza localStorage');
            return self.clients.claim();
        })
    );
});

// Gestisce messaggi dall'app principale
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('Service Worker: Ricevuto comando SKIP_WAITING per v6');
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_UPDATE') {
        console.log('Service Worker: Aggiornamento cache v6 richiesto');
        event.waitUntil(updateCache());
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        console.log('Service Worker: Richiesta versione corrente');
        event.ports[0].postMessage({
            version: 'v6',
            landingPageVersion: '3.0.0',
            matematicaVersion: '3.0.0',
            tabellineVersion: '1.0.0',
            installationFeatures: [
                'Card installazione persistente',
                'Nasconde automaticamente dopo installazione',
                'Istruzioni Android corrette',
                'Gestione localStorage per persistenza'
            ],
            features: [
                'Landing page finale con installazione smart',
                'Matematica: 6 operazioni, 33 livelli',
                'Tabelline: timer 60s, 3 livelli',
                'Installazione persistente - card sparisce per sempre',
                'Istruzioni specifiche per ogni browser/dispositivo'
            ]
        });
    }
    
    if (event.data && event.data.type === 'GET_STATS') {
        console.log('Service Worker: Richiesta statistiche finali');
        event.ports[0].postMessage({
            giochiDisponibili: 2,
            inSviluppo: 1,
            matematicaLivelli: 33,
            tabellineLivelli: 3,
            dispositiviSupportati: ['Desktop', 'Android', 'iOS'],
            installationPersistent: true,
            androidInstructionsFixed: true
        });
    }
    
    if (event.data && event.data.type === 'CHECK_INSTALLATION') {
        console.log('Service Worker: Controllo stato installazione');
        // Coordina con l'index.html per controlli installazione
        event.ports[0].postMessage({
            shouldCheckInstallation: true,
            useLocalStorage: true,
            hideCardPermanently: true
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
    if (url.includes('manifest') || url.includes('icon') || url.includes('.png')) {
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
        console.log('Service Worker: Aggiornamento forzato cache v6...');
        
        await Promise.all(
            urlsToCache.map(async (url) => {
                await cache.delete(url);
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response);
                    console.log('Service Worker: Aggiornato v6:', url);
                }
            })
        );
        
        console.log('Service Worker: Cache v6 aggiornata completamente');
        console.log('🎉 Piattaforma Giochi Educativi v6 finale pronta!');
        
        // Notifica all'app che l'aggiornamento è completato
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CACHE_UPDATED',
                version: 'v6',
                message: 'Piattaforma aggiornata alla versione finale!',
                finalFeatures: {
                    giochiDisponibili: 2,
                    inSviluppo: 1,
                    installationPersistent: true,
                    cardHidesPermanently: true,
                    androidInstructionsFixed: true,
                    features: [
                        'Installazione Smart persistente',
                        'Card sparisce permanentemente',
                        'Istruzioni Android corrette',
                        'Matematica 6 operazioni complete',
                        'Tabelline 3 livelli difficoltà'
                    ]
                }
            });
        });
        
    } catch (error) {
        console.error('Service Worker: Errore durante aggiornamento cache v6:', error);
    }
}

// Gestisce sync in background
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered per v6');
        event.waitUntil(updateCache());
    }
});

// Gestione notifiche push per aggiornamenti
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        console.log('Service Worker: Push notification ricevuta:', data);
        
        if (data.type === 'installation_complete') {
            event.waitUntil(
                self.registration.showNotification('🎉 Installazione Completata!', {
                    body: 'Giochi Educativi è ora installato sul tuo dispositivo!',
                    icon: '/icon-192.png',
                    badge: '/icon-192.png',
                    tag: 'installation-complete',
                    actions: [
                        {
                            action: 'open',
                            title: '🚀 Apri App'
                        }
                    ]
                })
            );
        }
        
        if (data.type === 'new_game') {
            event.waitUntil(
                self.registration.showNotification('🎮 Nuovo Gioco Disponibile!', {
                    body: data.message || 'È stato aggiunto un nuovo gioco educativo!',
                    icon: '/icon-192.png',
                    badge: '/icon-192.png',
                    tag: 'new-game',
                    actions: [
                        {
                            action: 'play',
                            title: '🚀 Gioca Ora'
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
    
    if (event.action === 'open' || event.action === 'play') {
        event.waitUntil(
            clients.openWindow('./index.html')
        );
    } else {
        // Click generale sulla notifica
        event.waitUntil(
            clients.openWindow('./index.html')
        );
    }
});

// Gestione installazione app
self.addEventListener('install', event => {
    console.log('🚀 Service Worker v6 installato!');
    console.log('🎮 Piattaforma Giochi Educativi - Versione Finale');
    console.log('✨ Installazione Smart persistente attiva');
    console.log('📱 Istruzioni Android corrette implementate');
    console.log('💾 Persistenza localStorage configurata');
});

// Notifica quando il service worker v6 è pronto
console.log('🚀 Service Worker v6 caricato - Versione Finale!');
console.log('🎮 Piattaforma Giochi Educativi - Maestro Alberto');
console.log('📊 Stats finali: 2 giochi disponibili, 1 in sviluppo');
console.log('✨ Installazione Smart persistente con localStorage');
console.log('🤖 Card installazione che scompare permanentemente');
console.log('📱 Istruzioni Android corrette (tre trattini)');
