const CACHE_NAME = 'giochi-educativi-v8'; // ⬆️ VERSIONE v8 con matematica.html integrato
const urlsToCache = [
    './',
    './index.html',                // ✅ Landing page con installazione smart persistente
    './matematica.html',           // ✅ Matematica v4.0.0 integrata nel sistema PWA unificato
    './tabelline.html',           // ✅ Sfida Tabelline con timer 60s e 3 livelli
    './games.json',               // ✅ JSON v1.7.0 con integrazione matematica completa
    './manifest.json',            // ✅ PWA manifest per installazione
    './icon-192.png',             // ✅ Icone PWA
    './icon-512.png'
];

self.addEventListener('install', event => {
    console.log('Service Worker: Install Event v8 - Sistema PWA Unificato Completo');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache aperta:', CACHE_NAME);
                console.log('Service Worker: Sistema PWA Unificato v8 con:');
                console.log('  - 🎮 Landing page con installazione smart persistente');
                console.log('  - 🧮 Matematica v4.0.0 completamente integrata');
                console.log('  - 🎯 Sfida Tabelline sincronizzata');
                console.log('  - 📄 Games.json v1.7.0 con metadati integrazione');
                console.log('  - 🔄 Sincronizzazione localStorage unificata');
                console.log('  - 📱 PWA installabile con controlli integrati');
                console.log('  - 🚫 Rimossi sistemi PWA duplicati');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Tutti i file v8 cachati con successo');
                console.log('🎉 Sistema PWA Unificato Completo operativo!');
                self.skipWaiting(); // Forza l'attivazione immediata
            })
            .catch(error => {
                console.error('Service Worker: Errore durante il caching v8:', error);
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
                        console.log('Service Worker: index.html v8 dalla cache');
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
                    console.log('Service Worker: index.html v8 dalla rete');
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
                    console.log('Service Worker: games.json v1.7.0 aggiornato dalla rete');
                    console.log('  - Matematica v4.0.0: Integrata nel sistema PWA unificato');
                    console.log('  - Tabelline: timer 60s, 3 livelli');
                    console.log('  - Sistema: PWA unificato senza duplicazioni');
                    console.log('  - localStorage: Sincronizzazione completa');
                    console.log('  - Installazione: Controlli unificati');
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

    // Gestione speciale per matematica.html integrata (cache-first con background update)
    if (event.request.url.includes('matematica.html')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        console.log('Service Worker: matematica.html v4.0.0 dalla cache (integrata)');
                        console.log('  - Sistema PWA: Completamente unificato');
                        console.log('  - localStorage: Sincronizzato con index.html');
                        console.log('  - PWA: Rimosse duplicazioni installazione');
                        console.log('  - Navigazione: Integrata nel sistema principale');
                        
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
                    
                    console.log('Service Worker: matematica.html v4.0.0 dalla rete (integrata)');
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
                    console.log('Service Worker: Serving from cache v8:', event.request.url.split('/').pop());
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
    console.log('Service Worker: Activate Event v8 - Sistema PWA Unificato Completo');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando cache vecchia:', cacheName);
                        console.log('  - Aggiornando a v8 con matematica integrata');
                        console.log('  - Rimuovendo sistemi PWA duplicati');
                        console.log('  - Implementando sincronizzazione localStorage');
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Ora controlla tutte le pagine con v8');
            console.log('🎉 Sistema PWA Unificato Completo v8 attivo:');
            console.log('  ✅ Landing page con installazione smart persistente');
            console.log('  ✅ Matematica v4.0.0 completamente integrata');
            console.log('  ✅ Tabelline sincronizzate nel sistema');
            console.log('  ✅ Games.json v1.7.0 con metadati integrazione');
            console.log('  ✅ localStorage unificato per stato installazione');
            console.log('  ✅ Navigazione fluida tra componenti');
            console.log('  ✅ Nessuna duplicazione PWA/Service Worker');
            console.log('  ✅ Cache strategy ottimizzata per ogni componente');
            return self.clients.claim();
        })
    );
});

// Gestisce messaggi dall'app principale
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('Service Worker: Ricevuto comando SKIP_WAITING per v8');
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_UPDATE') {
        console.log('Service Worker: Aggiornamento cache v8 richiesto');
        event.waitUntil(updateCache());
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        console.log('Service Worker: Richiesta versione corrente');
        event.ports[0].postMessage({
            version: 'v8',
            landingPageVersion: '3.0.0',
            matematicaVersion: '4.0.0',
            tabellineVersion: '1.0.0',
            gamesJsonVersion: '1.7.0',
            unifiedSystemFeatures: [
                'Matematica completamente integrata',
                'localStorage sincronizzato tra componenti',
                'Navigazione unificata',
                'Controlli installazione centralizzati',
                'Cache strategy ottimizzata per ogni file',
                'Nessuna duplicazione PWA/Service Worker'
            ],
            integrationStatus: {
                matematicaIntegrata: true,
                duplicazioniRimosse: true,
                localStorageSincronizzato: true,
                navigationeUnificata: true,
                sistemaFunzionante: true
            }
        });
    }
    
    if (event.data && event.data.type === 'GET_STATS') {
        console.log('Service Worker: Richiesta statistiche sistema unificato');
        event.ports[0].postMessage({
            giochiDisponibili: 2,
            inSviluppo: 1,
            matematicaLivelli: 33,
            tabellineLivelli: 3,
            dispositiviSupportati: ['Desktop', 'Android', 'iOS'],
            sistemaUnificato: true,
            matematicaIntegrata: true,
            duplicazioniPWA: false,
            localStorageSincronizzato: true,
            versioneServiceWorker: 'v8',
            versioneMatematica: '4.0.0',
            versioneGamesJson: '1.7.0'
        });
    }
    
    if (event.data && event.data.type === 'CHECK_INSTALLATION') {
        console.log('Service Worker: Controllo stato installazione unificato');
        // Coordina con tutto il sistema per controlli installazione
        event.ports[0].postMessage({
            shouldCheckInstallation: true,
            useLocalStorage: true,
            hideCardPermanently: true,
            unifiedSystem: true,
            matematicaIntegrated: true
        });
    }
    
    if (event.data && event.data.type === 'MATEMATICA_INTEGRATION_STATUS') {
        console.log('Service Worker: Richiesta stato integrazione matematica');
        event.ports[0].postMessage({
            matematicaIntegrata: true,
            sistemiPWADuplicatiRimossi: true,
            localStorageSincronizzato: true,
            navigationeUnificata: true,
            serviceWorkerUnificato: true,
            versioneMatematica: '4.0.0',
            versioneServiceWorker: 'v8',
            statoIntegrazione: 'COMPLETA',
            conflittiPWA: false,
            funzionamentoOttimale: true
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
        console.log('Service Worker: Aggiornamento forzato cache v8...');
        
        await Promise.all(
            urlsToCache.map(async (url) => {
                await cache.delete(url);
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response);
                    console.log('Service Worker: Aggiornato v8:', url);
                }
            })
        );
        
        console.log('Service Worker: Cache v8 aggiornata completamente');
        console.log('🎉 Sistema PWA Unificato v8 completo pronto!');
        
        // Notifica all'app che l'aggiornamento è completato
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CACHE_UPDATED',
                version: 'v8',
                message: 'Sistema PWA Unificato aggiornato alla versione v8!',
                unifiedSystemFeatures: {
                    giochiDisponibili: 2,
                    inSviluppo: 1,
                    matematicaIntegrata: true,
                    sistemaUnificato: true,
                    duplicazioniRimosse: true,
                    localStorageSincronizzato: true,
                    features: [
                        'Matematica v4.0.0 completamente integrata',
                        'Sistema PWA unificato senza duplicazioni',
                        'localStorage sincronizzato tra componenti',
                        'Navigazione fluida e unificata',
                        'Cache strategy ottimizzata',
                        'Controlli installazione centralizzati'
                    ]
                }
            });
        });
        
    } catch (error) {
        console.error('Service Worker: Errore durante aggiornamento cache v8:', error);
    }
}

// Gestisce sync in background
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered per v8');
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
                    body: 'Giochi Educativi è ora installato con sistema PWA unificato!',
                    icon: '/icon-192.png',
                    badge: '/icon-192.png',
                    tag: 'installation-complete',
                    actions: [
                        {
                            action: 'open',
                            title: '🚀 Apri App'
                        },
                        {
                            action: 'matematica',
                            title: '🧮 Matematica'
                        }
                    ]
                })
            );
        }
        
        if (data.type === 'matematica_integrated') {
            event.waitUntil(
                self.registration.showNotification('🧮 Matematica Integrata!', {
                    body: 'Matematica sul Divano è ora completamente integrata nel sistema PWA!',
                    icon: '/icon-192.png',
                    badge: '/icon-192.png',
                    tag: 'matematica-integrated',
                    actions: [
                        {
                            action: 'play-matematica',
                            title: '🚀 Gioca Ora'
                        }
                    ]
                })
            );
        }
        
        if (data.type === 'new_game') {
            event.waitUntil(
                self.registration.showNotification('🎮 Nuovo Gioco Disponibile!', {
                    body: data.message || 'È stato aggiunto un nuovo gioco educativo al sistema unificato!',
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
    } else if (event.action === 'matematica' || event.action === 'play-matematica') {
        event.waitUntil(
            clients.openWindow('./matematica.html')
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
    console.log('🚀 Service Worker v8 installato!');
    console.log('🎮 Sistema PWA Unificato Completo - Maestro Alberto');
    console.log('✨ Matematica v4.0.0 completamente integrata');
    console.log('📱 localStorage sincronizzato tra componenti');
    console.log('🔄 Cache strategy ottimizzata per ogni file');
    console.log('🚫 Rimossi sistemi PWA duplicati');
    console.log('💾 Controlli installazione centralizzati');
});

// Notifica quando il service worker v8 è pronto
console.log('🚀 Service Worker v8 caricato - Sistema PWA Unificato Completo!');
console.log('🎮 Piattaforma Giochi Educativi - Maestro Alberto');
console.log('📊 Sistema completamente unificato:');
console.log('  ✅ Matematica v4.0.0 integrata (6 operazioni, 33 livelli)');
console.log('  ✅ Tabelline sincronizzate (timer 60s, 3 livelli)');
console.log('  ✅ Games.json v1.7.0 con metadati integrazione');
console.log('  ✅ localStorage unificato per stato installazione');
console.log('  ✅ Navigazione fluida tra componenti');
console.log('  ✅ Cache strategy ottimizzata per performance');
console.log('  ✅ Nessuna duplicazione PWA/Service Worker');
console.log('🎯 Sistema pronto per utilizzo ottimale!');
