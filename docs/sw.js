// Service Worker v8.3.3 - PWA Giochi Educativi Unificati
// Updated per supportare Sfida Matematica in Famiglia 3ª

const CACHE_NAME = 'giochi-educativi-v8.3.3';
const DATA_CACHE_NAME = 'giochi-data-v8.3.3';

// File da cachare per il funzionamento offline
const FILES_TO_CACHE = [
    './',
    './index.html',
    './matematica.html',
    './tabelline.html',
    './sfida-matematica.html',
    './games.json',
    './manifest.json'
];

// File di dati che cambiano frequentemente
const DATA_URLS = [
    './games.json'
];

// Installazione del Service Worker
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install v8.3.3');
    
    event.waitUntil(
        Promise.all([
            // Cache dei file statici
            caches.open(CACHE_NAME).then((cache) => {
                console.log('[ServiceWorker] Pre-caching offline page');
                return cache.addAll(FILES_TO_CACHE);
            }),
            
            // Cache separata per i dati
            caches.open(DATA_CACHE_NAME).then((cache) => {
                console.log('[ServiceWorker] Pre-caching data files');
                return cache.addAll(DATA_URLS);
            })
        ])
    );
    
    // Forza l'attivazione immediata del nuovo SW
    self.skipWaiting();
});

// Attivazione del Service Worker
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate v8.3.3');
    
    event.waitUntil(
        // Rimuovi cache vecchie
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
                        console.log('[ServiceWorker] Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Prendi il controllo di tutti i client
    self.clients.claim();
    
    // Notifica tutti i client che è disponibile un aggiornamento
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage({
                type: 'SW_UPDATED',
                version: '8.3.3',
                message: 'Service Worker aggiornato alla versione 8.3.3 con supporto completo per Sfida Matematica!'
            });
        });
    });
});

// Gestione delle richieste di rete
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignora richieste non-HTTP
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Strategia speciale per sfida-matematica.html
    if (url.pathname.endsWith('/sfida-matematica.html')) {
        event.respondWith(handleSfidaMatematica(request));
        return;
    }
    
    // Strategia per file di dati (games.json)
    if (DATA_URLS.some(dataUrl => request.url.includes(dataUrl))) {
        event.respondWith(handleDataRequest(request));
        return;
    }
    
    // Strategia per file HTML principali
    if (request.destination === 'document') {
        event.respondWith(handleDocumentRequest(request));
        return;
    }
    
    // Strategia per altre risorse
    event.respondWith(handleOtherRequests(request));
});

// Gestione specifica per sfida-matematica.html
async function handleSfidaMatematica(request) {
    try {
        console.log('[ServiceWorker] Handling Sfida Matematica request');
        
        // Prova prima dalla cache
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('[ServiceWorker] Serving Sfida Matematica from cache');
            
            // Aggiorna in background
            fetch(request).then(async (response) => {
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    cache.put(request, responseClone);
                    console.log('[ServiceWorker] Updated Sfida Matematica in cache');
                }
            }).catch(() => {
                // Ignora errori di rete in background
            });
            
            return cachedResponse;
        }
        
        // Se non in cache, prova dalla rete
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            cache.put(request, responseClone);
            console.log('[ServiceWorker] Cached Sfida Matematica from network');
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('[ServiceWorker] Error handling Sfida Matematica:', error);
        
        // Fallback: prova a servire dalla cache comunque
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Ultimo fallback: pagina di errore offline
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Offline - Sfida Matematica</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: 'Comic Sans MS', cursive, sans-serif; 
                        text-align: center; 
                        padding: 50px; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .offline-message {
                        background: rgba(255,255,255,0.1);
                        padding: 30px;
                        border-radius: 15px;
                        backdrop-filter: blur(10px);
                    }
                    button {
                        background: #28a745;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-size: 18px;
                        cursor: pointer;
                        margin-top: 20px;
                        font-family: inherit;
                    }
                </style>
            </head>
            <body>
                <div class="offline-message">
                    <h1>🎯 Sfida Matematica Offline</h1>
                    <p>La connessione non è disponibile, ma i tuoi progressi sono al sicuro!</p>
                    <p>Riprova quando tornerai online.</p>
                    <button onclick="window.location.reload()">🔄 Riprova</button>
                    <button onclick="window.location.href='./'">🏠 Torna al Menu</button>
                </div>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

// Gestione richieste di dati
async function handleDataRequest(request) {
    try {
        // Network First per i dati
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DATA_CACHE_NAME);
            cache.put(request, networkResponse.clone());
            console.log('[ServiceWorker] Updated data cache');
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('[ServiceWorker] Network failed, serving data from cache');
        
        const cache = await caches.open(DATA_CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback per games.json
        if (request.url.includes('games.json')) {
            return new Response(JSON.stringify({
                games: [],
                categories: [],
                settings: {
                    title: "Giochi Educativi",
                    subtitle: "by Maestro Alberto",  
                    version: "1.9.0 (Offline)",
                    offline: true
                }
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        throw error;
    }
}

// Gestione richieste di documenti
async function handleDocumentRequest(request) {
    try {
        // Cache First per i documenti HTML
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('[ServiceWorker] Serving document from cache:', request.url);
            
            // Aggiorna in background
            fetch(request).then(async (response) => {
                if (response && response.status === 200) {
                    cache.put(request, response.clone());
                    console.log('[ServiceWorker] Updated document in cache');
                }
            }).catch(() => {
                // Ignora errori di rete
            });
            
            return cachedResponse;
        }
        
        // Se non in cache, prova dalla rete
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
            console.log('[ServiceWorker] Cached document from network');
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('[ServiceWorker] Serving offline fallback');
        
        // Fallback offline per l'index
        return new Response(`
            <!DOCTYPE html>
            <html lang="it">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Giochi Educativi - Offline</title>
                <style>
                    body { 
                        font-family: 'Comic Sans MS', cursive, sans-serif; 
                        text-align: center; 
                        padding: 20px; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .container {
                        background: rgba(255,255,255,0.1);
                        padding: 40px;
                        border-radius: 20px;
                        backdrop-filter: blur(15px);
                        max-width: 500px;
                    }
                    button {
                        background: #28a745;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-size: 18px;
                        cursor: pointer;
                        margin: 10px;
                        font-family: inherit;
                        transition: transform 0.2s;
                    }
                    button:hover { transform: scale(1.05); }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🎮 Giochi Educativi</h1>
                    <h2>Modalità Offline</h2>
                    <p>🔌 Connessione non disponibile</p>
                    <p>I tuoi progressi e profili sono al sicuro!</p>
                    <button onclick="window.location.reload()">🔄 Riprova</button>
                    <br>
                    <small>Service Worker v8.3.3 attivo</small>
                </div>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

// Gestione altre richieste
async function handleOtherRequests(request) {
    try {
        // Cache First per altre risorse
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('[ServiceWorker] Request failed:', request.url);
        throw error;
    }
}

// Gestione messaggi dai client
self.addEventListener('message', (event) => {
    console.log('[ServiceWorker] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
        
        // Notifica il client che il SW è stato aggiornato
        event.ports[0].postMessage({
            type: 'SW_ACTIVATED',
            version: '8.3.3'
        });
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            type: 'SW_VERSION',
            version: '8.3.3',
            cacheName: CACHE_NAME
        });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        Promise.all([
            caches.delete(CACHE_NAME),
            caches.delete(DATA_CACHE_NAME)
        ]).then(() => {
            event.ports[0].postMessage({
                type: 'CACHE_CLEARED',
                version: '8.3.3'
            });
        });
    }
});

// Gestione errori
self.addEventListener('error', (event) => {
    console.error('[ServiceWorker] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('[ServiceWorker] Unhandled promise rejection:', event.reason);
});

// Sincronizzazione in background
self.addEventListener('sync', (event) => {
    console.log('[ServiceWorker] Background sync:', event.tag);
    
    if (event.tag === 'profile-sync') {
        event.waitUntil(syncProfiles());
    }
    
    if (event.tag === 'game-data-sync') {
        event.waitUntil(syncGameData());
    }
});

// Funzione di sincronizzazione profili
async function syncProfiles() {
    try {
        console.log('[ServiceWorker] Syncing profiles...');
        
        // Qui puoi implementare la logica di sincronizzazione
        // dei profili con un server se necessario
        
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'PROFILES_SYNCED',
                timestamp: Date.now()
            });
        });
        
    } catch (error) {
        console.error('[ServiceWorker] Profile sync failed:', error);
    }
}

// Funzione di sincronizzazione dati di gioco
async function syncGameData() {
    try {
        console.log('[ServiceWorker] Syncing game data...');
        
        // Aggiorna games.json
        const cache = await caches.open(DATA_CACHE_NAME);
        const response = await fetch('./games.json');
        
        if (response && response.status === 200) {
            await cache.put('./games.json', response.clone());
            console.log('[ServiceWorker] Game data synced');
        }
        
    } catch (error) {
        console.error('[ServiceWorker] Game data sync failed:', error);
    }
}

// Notifiche push se necessarie
self.addEventListener('push', (event) => {
    console.log('[ServiceWorker] Push received');
    
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body || 'Nuovi aggiornamenti disponibili!',
            icon: './icon-192x192.png',
            badge: './icon-72x72.png',
            tag: data.tag || 'general',
            data: data.data || {}
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'Giochi Educativi', options)
        );
    }
});

// Click su notifiche
self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification clicked');
    
    event.notification.close();
    
    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clients) => {
            // Se c'è già una finestra aperta, focusla
            for (const client of clients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // Altrimenti apri una nuova finestra
            return self.clients.openWindow('./');
        })
    );
});

console.log('[ServiceWorker] v8.3.3 loaded with Sfida Matematica support');
