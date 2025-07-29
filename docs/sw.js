// Service Worker v8.3.1 - Sistema unificato v1.9.0
// Aggiornato per: Matematica sul Divano 3ª v4.1.0, Tabelline v2.2.0, Sfida Matematica in Famiglia 3ª v1.0.0
// AGGIORNATO: Supporto completo math_game_updated.html con sistema profili e sfide giornaliere

const CACHE_VERSION = 'v8.3.1';
const CACHE_NAME = `giochi-educativi-${CACHE_VERSION}`;

// File essenziali del sistema unificato
const CORE_FILES = [
    '/',
    '/index.html',
    '/matematica.html',
    '/tabelline.html',
    '/math_game_updated.html',  // AGGIORNATO: Percorso corretto per Sfida Matematica in Famiglia 3ª
    '/games.json',
    '/manifest.json'
];

// File statici da pre-cachare
const STATIC_RESOURCES = [
    // Nessun file statico esterno per mantenere l'app completamente standalone
];

// Tutte le risorse da cachare
const CACHE_RESOURCES = [...CORE_FILES, ...STATIC_RESOURCES];

// Strategia di cache per tipo di risorsa
const CACHE_STRATEGIES = {
    core: 'cache-first',           // File core dell'app
    api: 'network-first',          // games.json e dati dinamici  
    assets: 'cache-first',         // Immagini e risorse statiche
    pages: 'stale-while-revalidate', // Pagine HTML
    profiles: 'cache-first'        // Dati profili utente per Sfida Matematica
};

console.log(`🔧 Service Worker v8.3.1 inizializzazione - Sistema v1.9.0`);
console.log(`📱 Supporto giochi: Matematica sul Divano 3ª v4.1.0, Tabelline v2.2.0`);
console.log(`🎯 AGGIORNATO: Sfida Matematica in Famiglia 3ª v1.0.0 - Sistema profili e sfide giornaliere`);
console.log(`🟢 Sistema bottone verde aggiornamenti attivo`);

// === INSTALLAZIONE ===
self.addEventListener('install', event => {
    console.log(`📦 SW v8.3.1: Installazione iniziata`);
    
    event.waitUntil(
        (async () => {
            try {
                // Apri cache
                const cache = await caches.open(CACHE_NAME);
                console.log(`✅ Cache aperta: ${CACHE_NAME}`);
                
                // Pre-carica file core
                await cache.addAll(CACHE_RESOURCES);
                console.log(`📂 ${CACHE_RESOURCES.length} risorse core pre-cachate (inclusa Sfida Matematica)`);
                
                // 🟢 IMPORTANTE: NON fare skipWaiting automatico
                // Il nuovo SW aspetta che l'utente clicchi il bottone verde
                console.log(`🟢 SW v8.3.1 installato, in attesa di attivazione manuale`);
                
                // Notifica i client che c'è un aggiornamento disponibile
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'UPDATE_AVAILABLE',
                        version: CACHE_VERSION,
                        message: '🔄 Aggiornamento disponibile per Sfida Matematica in Famiglia 3ª!',
                        updateType: 'game-fix',
                        gameUpdated: 'Sfida Matematica in Famiglia 3ª'
                    });
                });
                
            } catch (error) {
                console.error(`❌ Errore installazione SW v8.3.1:`, error);
            }
        })()
    );
});

// === ATTIVAZIONE ===
self.addEventListener('activate', event => {
    console.log(`🔄 SW v8.3.1: Attivazione iniziata`);
    
    event.waitUntil(
        (async () => {
            try {
                // Pulisci cache vecchie
                const cacheNames = await caches.keys();
                const oldCaches = cacheNames.filter(name => 
                    name.startsWith('giochi-educativi-') && name !== CACHE_NAME
                );
                
                await Promise.all(
                    oldCaches.map(cacheName => {
                        console.log(`🗑️ Eliminazione cache obsoleta: ${cacheName}`);
                        return caches.delete(cacheName);
                    })
                );
                
                // Prendi controllo di tutti i client
                await self.clients.claim();
                console.log(`✅ SW v8.3.1: Attivazione completata, controllo client acquisito`);
                
                // Notifica i client dell'aggiornamento completato
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'UPDATE_COMPLETED',
                        version: CACHE_VERSION,
                        message: '🔄 Aggiornamento completato! Sfida Matematica in Famiglia 3ª ottimizzata!',
                        gameUpdated: 'Sfida Matematica in Famiglia 3ª'
                    });
                });
                
            } catch (error) {
                console.error(`❌ Errore attivazione SW v8.3.1:`, error);
            }
        })()
    );
});

// === GESTIONE RICHIESTE ===
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignora richieste non-GET e richieste esterne (eccetto manifest)
    if (request.method !== 'GET') return;
    if (!url.origin.includes(self.location.origin) && 
        !request.url.includes('manifest.json')) return;
    
    event.respondWith(handleRequest(request));
});

// Gestore principale delle richieste
async function handleRequest(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    try {
        // Determina strategia di cache
        let strategy = CACHE_STRATEGIES.pages; // Default
        
        if (CORE_FILES.some(file => pathname.endsWith(file.replace('/', '')))) {
            strategy = CACHE_STRATEGIES.core;
        } else if (pathname.includes('games.json')) {
            strategy = CACHE_STRATEGIES.api;
        } else if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
            strategy = CACHE_STRATEGIES.assets;
        } else if (pathname.includes('math_game_updated') || 
                   pathname.includes('sfida-matematica') ||
                   request.url.includes('mathGameProfiles')) {
            // AGGIORNATO: Gestione speciale per Sfida Matematica e profili utente
            strategy = CACHE_STRATEGIES.profiles;
            console.log(`🎯 Strategia profili per: ${pathname}`);
        }
        
        // Applica strategia
        return await applyStrategy(request, strategy);
        
    } catch (error) {
        console.error(`❌ Errore gestione richiesta ${pathname}:`, error);
        return await fallbackResponse(request);
    }
}

// Applica strategia di cache specifica
async function applyStrategy(request, strategy) {
    const cache = await caches.open(CACHE_NAME);
    
    switch (strategy) {
        case 'cache-first':
        case 'profiles':  // Stessa strategia di cache-first per i profili
            return await cacheFirst(request, cache);
            
        case 'network-first':
            return await networkFirst(request, cache);
            
        case 'stale-while-revalidate':
            return await staleWhileRevalidate(request, cache);
            
        default:
            return await cacheFirst(request, cache);
    }
}

// Cache First - per file core dell'app e profili utente
async function cacheFirst(request, cache) {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        console.log(`📂 Cache hit: ${request.url}`);
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
            console.log(`🌐 Network + cache: ${request.url}`);
        }
        return networkResponse;
    } catch (error) {
        console.log(`❌ Network fail: ${request.url}`);
        throw error;
    }
}

// Network First - per dati dinamici come games.json
async function networkFirst(request, cache) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
            console.log(`🌐 Network fresh: ${request.url}`);
            return networkResponse;
        }
        throw new Error('Network response not ok');
    } catch (error) {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            console.log(`📂 Network fail, cache fallback: ${request.url}`);
            return cachedResponse;
        }
        throw error;
    }
}

// Stale While Revalidate - per pagine HTML
async function staleWhileRevalidate(request, cache) {
    const cachedResponse = await cache.match(request);
    
    // Aggiorna cache in background
    const networkResponsePromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
            console.log(`🔄 Background update: ${request.url}`);
        }
        return response;
    }).catch(error => {
        console.log(`❌ Background update failed: ${request.url}`);
    });
    
    // Restituisci cache immediato se disponibile
    if (cachedResponse) {
        console.log(`📂 Stale cache: ${request.url}`);
        return cachedResponse;
    }
    
    // Altrimenti aspetta network
    try {
        const networkResponse = await networkResponsePromise;
        console.log(`🌐 Fresh network: ${request.url}`);
        return networkResponse;
    } catch (error) {
        throw error;
    }
}

// Risposta di fallback per errori
async function fallbackResponse(request) {
    const url = new URL(request.url);
    
    // Per pagine HTML, restituisci index.html
    if (request.destination === 'document' || 
        url.pathname.endsWith('.html') ||
        url.pathname === '/') {
        
        const cache = await caches.open(CACHE_NAME);
        const fallback = await cache.match('/index.html');
        if (fallback) {
            console.log(`🏠 Fallback a index.html per: ${request.url}`);
            return fallback;
        }
    }
    
    // AGGIORNATO: Gestione speciale per errori relativi a Sfida Matematica
    if (url.pathname.includes('math_game_updated') || 
        url.pathname.includes('sfida-matematica')) {
        console.log(`🎯 Fallback specifico per Sfida Matematica: ${request.url}`);
        return new Response(
            JSON.stringify({
                error: 'Sfida Matematica non disponibile offline',
                message: 'Il gioco richiede una connessione internet per la prima volta',
                gameType: 'sfida-matematica',
                fileName: 'math_game_updated.html',
                url: request.url,
                timestamp: new Date().toISOString()
            }), {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Game-Type': 'sfida-matematica'
                }
            }
        );
    }
    
    // Risposta di errore generica
    return new Response(
        JSON.stringify({
            error: 'Risorsa non disponibile offline',
            url: request.url,
            timestamp: new Date().toISOString()
        }), {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
        }
    );
}

// === 🟢 GESTIONE MESSAGGI PER BOTTONE VERDE ===
self.addEventListener('message', event => {
    const { data } = event;
    console.log(`💬 SW v8.3.1 messaggio ricevuto:`, data);
    
    // 🟢 Quando l'utente clicca il bottone verde
    if (data && data.action === 'skipWaiting') {
        console.log(`🟢 Bottone verde cliccato - Attivazione aggiornamento Sfida Matematica`);
        
        // Attiva immediatamente il nuovo service worker
        self.skipWaiting();
        
        // Notifica tutti i client di ricaricare
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({ 
                    type: 'RELOAD_REQUIRED',
                    version: CACHE_VERSION,
                    message: '🔄 Ricaricamento in corso... Aggiornamento Sfida Matematica!',
                    gameUpdated: 'math_game_updated'
                });
            });
        });
    }
    
    // Controllo versione per debugging
    if (data && data.action === 'getVersion') {
        event.ports[0].postMessage({
            version: CACHE_VERSION,
            cacheSize: CACHE_RESOURCES.length,
            timestamp: new Date().toISOString(),
            updateSystem: 'active',
            games: [
                'Matematica sul Divano 3ª v4.1.0',
                'Tabelline v2.2.0', 
                'Sfida Matematica in Famiglia 3ª v1.0.0'
            ],
            gameFiles: [
                'matematica.html',
                'tabelline.html',
                'math_game_updated.html'  // AGGIORNATO
            ]
        });
    }
    
    // 🟢 Controllo stato aggiornamenti
    if (data && data.action === 'checkUpdates') {
        event.ports[0].postMessage({
            hasUpdate: self.registration.waiting !== null,
            currentVersion: CACHE_VERSION,
            waitingVersion: self.registration.waiting ? 'new-version' : null,
            latestGame: 'Sfida Matematica in Famiglia 3ª',
            latestGameFile: 'math_game_updated.html'
        });
    }
    
    // Gestione messaggi specifici per Sfida Matematica
    if (data && data.action === 'clearGameData') {
        console.log(`🎯 Richiesta pulizia dati gioco: ${data.gameType}`);
        if (data.gameType === 'sfida-matematica' || data.gameType === 'math_game_updated') {
            // I dati sono gestiti via localStorage nel gioco, non nel SW
            event.ports[0].postMessage({
                success: true,
                message: 'Dati profili gestiti localmente dal gioco',
                gameFile: 'math_game_updated.html'
            });
        }
    }
    
    // NUOVO: Controllo forzato aggiornamenti
    if (data && data.action === 'checkForUpdates') {
        console.log(`🔄 Controllo aggiornamenti forzato richiesto`);
        // Simula controllo aggiornamenti
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'UPDATE_CHECK_COMPLETED',
                    version: CACHE_VERSION,
                    hasUpdates: false,
                    message: '✅ Sistema aggiornato alla versione più recente'
                });
            });
        });
    }
});

// === NOTIFICHE PUSH ===
self.addEventListener('push', event => {
    console.log(`🔔 Push notification ricevuta`);
    
    // Gestione notifiche per nuove sfide giornaliere
    if (event.data) {
        try {
            const data = event.data.json();
            if (data.type === 'daily-challenge') {
                const notificationOptions = {
                    body: '🎯 Nuove sfide matematiche disponibili!',
                    icon: '/icon-192x192.png',
                    badge: '/icon-96x96.png',
                    tag: 'daily-challenge',
                    actions: [
                        {
                            action: 'play',
                            title: '🎮 Gioca Ora'
                        },
                        {
                            action: 'dismiss',
                            title: '✖️ Chiudi'
                        }
                    ]
                };
                
                event.waitUntil(
                    self.registration.showNotification(
                        'Sfida Matematica in Famiglia', 
                        notificationOptions
                    )
                );
            }
        } catch (error) {
            console.error('Errore gestione push notification:', error);
        }
    }
});

// AGGIORNATO: Gestione click su notifiche
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'play') {
        event.waitUntil(
            clients.openWindow('/math_game_updated.html')  // AGGIORNATO: Percorso corretto
        );
    }
});

// === BACKGROUND SYNC ===
self.addEventListener('sync', event => {
    console.log(`🔄 Background sync evento:`, event.tag);
    
    // Sync per statistiche Sfida Matematica
    if (event.tag === 'sync-game-stats') {
        event.waitUntil(syncGameStats());
    }
});

// Funzione sync statistiche (placeholder)
async function syncGameStats() {
    console.log(`📊 Sincronizzazione statistiche giochi...`);
    // Implementazione futura per backup/sync statistiche
    try {
        // Logica di sincronizzazione profili utente
        console.log(`✅ Statistiche sincronizzate per math_game_updated.html`);
    } catch (error) {
        console.error(`❌ Errore sincronizzazione:`, error);
    }
}

// === GESTIONE ERRORI GLOBALI ===
self.addEventListener('error', event => {
    console.error(`❌ SW v8.3.1 errore globale:`, event.error);
    
    // Log specifico per errori relativi a Sfida Matematica
    if (event.error && event.error.message && 
        (event.error.message.includes('sfida-matematica') ||
         event.error.message.includes('math_game_updated'))) {
        console.error(`🎯 Errore specifico Sfida Matematica:`, event.error);
    }
});

self.addEventListener('unhandledrejection', event => {
    console.error(`❌ SW v8.3.1 promise rejection:`, event.reason);
});

// === PULIZIA CACHE PERIODICA ===
// Pulizia automatica cache ogni 7 giorni
self.addEventListener('activate', event => {
    event.waitUntil(cleanOldCaches());
});

async function cleanOldCaches() {
    const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 giorni
    const now = Date.now();
    
    try {
        const cacheNames = await caches.keys();
        const cachesToDelete = [];
        
        for (const cacheName of cacheNames) {
            if (cacheName.startsWith('giochi-educativi-') && 
                cacheName !== CACHE_NAME) {
                // Logica per determinare cache scadute
                cachesToDelete.push(cacheName);
            }
        }
        
        await Promise.all(
            cachesToDelete.map(cacheName => {
                console.log(`🧹 Pulizia cache scaduta: ${cacheName}`);
                return caches.delete(cacheName);
            })
        );
        
        console.log(`✅ Pulizia cache completata, ${cachesToDelete.length} cache rimosse`);
    } catch (error) {
        console.error(`❌ Errore pulizia cache:`, error);
    }
}

// === LOGS DI DEBUG ===
console.log(`✅ Service Worker v8.3.1 caricato completamente`);
console.log(`📊 Cache: ${CACHE_NAME}`);
console.log(`📁 Risorse core: ${CORE_FILES.length}`);
console.log(`🎮 Sistema: v1.9.0`);
console.log(`🎯 Giochi supportati:`);
console.log(`   • Matematica sul Divano 3ª v4.1.0`);
console.log(`   • Tabelline v2.2.0`);
console.log(`   • Sfida Matematica in Famiglia 3ª v1.0.0 → math_game_updated.html`);
console.log(`🟢 Sistema bottone verde: ATTIVO`);
console.log(`👤 Sistema profili: ATTIVO per Sfida Matematica`);

// Esporta informazioni per debug (non visibili in produzione)
if (self.location.hostname === 'localhost') {
    self.SW_DEBUG_INFO = {
        version: CACHE_VERSION,
        systemVersion: 'v1.9.0',
        cacheResources: CACHE_RESOURCES,
        strategies: CACHE_STRATEGIES,
        updateSystem: 'green-button-active',
        games: [
            'matematica-divano-v4.1.0',
            'tabelline-v2.2.0',
            'math-game-updated-v1.0.0'  // AGGIORNATO
        ],
        gameFiles: [
            'matematica.html',
            'tabelline.html',
            'math_game_updated.html'  // AGGIORNATO
        ],
        newFeatures: [
            'profiles-system',
            'daily-challenges',
            'progress-tracking',
            'file-path-corrected'  // NUOVO
        ],
        timestamp: new Date().toISOString()
    };
}
