// Service Worker v8.1 - Sistema unificato v1.8.0
// Aggiornato per: Matematica v4.1.0, Tabelline v2.2.0

const CACHE_VERSION = 'v8.1.0';
const CACHE_NAME = `giochi-educativi-${CACHE_VERSION}`;

// File essenziali del sistema unificato
const CORE_FILES = [
    '/',
    '/index.html',
    '/matematica.html',
    '/tabelline.html',
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
    pages: 'stale-while-revalidate' // Pagine HTML
};

console.log(`🔧 Service Worker v8.1 inizializzazione - Sistema v1.8.0`);
console.log(`📱 Supporto giochi: Matematica v4.1.0, Tabelline v2.2.0`);

// === INSTALLAZIONE ===
self.addEventListener('install', event => {
    console.log(`📦 SW v8.1: Installazione iniziata`);
    
    event.waitUntil(
        (async () => {
            try {
                // Apri cache
                const cache = await caches.open(CACHE_NAME);
                console.log(`✅ Cache aperta: ${CACHE_NAME}`);
                
                // Pre-carica file core
                await cache.addAll(CACHE_RESOURCES);
                console.log(`📂 ${CACHE_RESOURCES.length} risorse core pre-cachate`);
                
                // Forza l'attivazione immediata
                await self.skipWaiting();
                console.log(`🚀 SW v8.1: Installazione completata, skip waiting attivato`);
                
            } catch (error) {
                console.error(`❌ Errore installazione SW v8.1:`, error);
            }
        })()
    );
});

// === ATTIVAZIONE ===
self.addEventListener('activate', event => {
    console.log(`🔄 SW v8.1: Attivazione iniziata`);
    
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
                console.log(`✅ SW v8.1: Attivazione completata, controllo client acquisito`);
                
                // Notifica i client dell'aggiornamento
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_ACTIVATED',
                        version: CACHE_VERSION,
                        message: 'Service Worker v8.1 attivato con successo'
                    });
                });
                
            } catch (error) {
                console.error(`❌ Errore attivazione SW v8.1:`, error);
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
            return await cacheFirst(request, cache);
            
        case 'network-first':
            return await networkFirst(request, cache);
            
        case 'stale-while-revalidate':
            return await staleWhileRevalidate(request, cache);
            
        default:
            return await cacheFirst(request, cache);
    }
}

// Cache First - per file core dell'app
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

// === GESTIONE MESSAGGI ===
self.addEventListener('message', event => {
    const { data } = event;
    console.log(`💬 SW v8.1 messaggio ricevuto:`, data);
    
    if (data && data.action === 'skipWaiting') {
        console.log(`⏭️ Skip waiting richiesto dal client`);
        self.skipWaiting();
        
        // Notifica tutti i client del refresh
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({ type: 'REFRESH' });
            });
        });
    }
    
    if (data && data.action === 'getVersion') {
        event.ports[0].postMessage({
            version: CACHE_VERSION,
            cacheSize: CACHE_RESOURCES.length,
            timestamp: new Date().toISOString()
        });
    }
});

// === NOTIFICHE PUSH (placeholder per future implementazioni) ===
self.addEventListener('push', event => {
    console.log(`🔔 Push notification ricevuta`);
    // Implementazione futura per notifiche di aggiornamenti giochi
});

// === BACKGROUND SYNC (placeholder per future implementazioni) ===
self.addEventListener('sync', event => {
    console.log(`🔄 Background sync evento:`, event.tag);
    // Implementazione futura per sincronizzazione offline
});

// === GESTIONE ERRORI GLOBALI ===
self.addEventListener('error', event => {
    console.error(`❌ SW v8.1 errore globale:`, event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error(`❌ SW v8.1 promise rejection:`, event.reason);
});

// === LOGS DI DEBUG ===
console.log(`✅ Service Worker v8.1 caricato completamente`);
console.log(`📊 Cache: ${CACHE_NAME}`);
console.log(`📁 Risorse core: ${CORE_FILES.length}`);
console.log(`🎮 Sistema: v1.8.0 con Matematica v4.1.0 e Tabelline v2.2.0`);

// Esporta informazioni per debug (non visibili in produzione)
if (self.location.hostname === 'localhost') {
    self.SW_DEBUG_INFO = {
        version: CACHE_VERSION,
        cacheResources: CACHE_RESOURCES,
        strategies: CACHE_STRATEGIES,
        timestamp: new Date().toISOString()
    };
}
