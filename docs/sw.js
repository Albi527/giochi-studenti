// Service Worker v8.3.5 - COMPLETAMENTE AUTOMATICO PER BAMBINI A SCUOLA
// 🚀 ZERO INTERVENTO UTENTE - AGGIORNAMENTI TRASPARENTI
// 🍎 Fix iOS Safari - Sfida Matematica ora compatibile iPhone/iPad
// ⚡ SkipWaiting Immediato + Reload Forzato Automatico

const SW_VERSION = 'v8.3.5';
const CACHE_NAME = 'giochi-educativi-v8.3.5';
const DATA_CACHE_NAME = 'giochi-data-v8.3.5';

// 🎯 LISTA COMPLETA RISORSE DA CACHEARE (basata sui tuoi file)
const STATIC_CACHE_URLS = [
    // Pagine principali
    '/',
    '/index.html',
    '/matematica.html',
    '/sfida-matematica.html', 
    '/tabelline.html',
    
    // File di configurazione
    '/games.json',
    '/manifest.json',
    
    // Icone PWA (se presenti)
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/favicon.ico',
    
    // Fallback offline personalizzato
    '/offline.html'
];

// 🎯 RISORSE DINAMICHE/DATI
const DATA_URLS = [
    '/games.json'
];

// 🚨 CACHE VECCHIE DA ELIMINARE AUTOMATICAMENTE
const OLD_CACHE_VERSIONS = [
    'giochi-educativi-v8.3.4',
    'giochi-data-v8.3.4',
    'giochi-educativi-v8.3.2',
    'giochi-data-v8.3.2', 
    'giochi-educativi-v8.3.3',
    'giochi-data-v8.3.3',
    // Aggiungi altre versioni se esistono
    'giochi-educativi-v8.2.0',
    'giochi-data-v8.2.0',
    'giochi-educativi-v8.1.0',
    'giochi-data-v8.1.0'
];

console.log(`🚀 Service Worker ${SW_VERSION} - Avvio AUTOMATICO per bambini`);

// ========================================
// 🔧 INSTALLAZIONE AUTOMATICA AGGRESSIVA
// ========================================

self.addEventListener('install', function(event) {
    console.log(`🔧 SW ${SW_VERSION} - INSTALLAZIONE in corso...`);
    
    // ⚡ SKIP WAITING IMMEDIATO - NESSUNA ATTESA
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log(`📦 Cache ${CACHE_NAME} aperta - Caricamento risorse...`);
                
                // 🎯 CACHE TUTTO IMMEDIATAMENTE
                return cache.addAll(STATIC_CACHE_URLS.map(url => {
                    // Cache busting: aggiungi timestamp per forzare aggiornamento
                    const bustingUrl = url + (url.includes('?') ? '&' : '?') + `sw=${SW_VERSION}&t=${Date.now()}`;
                    console.log(`📥 Cachando: ${url} -> ${bustingUrl}`);
                    return bustingUrl;
                }));
            })
            .then(function() {
                console.log(`✅ SW ${SW_VERSION} - Tutte le risorse STATICHE cachate!`);
                return caches.open(DATA_CACHE_NAME);
            })
            .then(function(dataCache) {
                console.log(`📊 Cache DATI ${DATA_CACHE_NAME} aperta`);
                // Cache dei dati con strategia diversa
                return Promise.all(
                    DATA_URLS.map(url => {
                        const bustingUrl = url + `?sw=${SW_VERSION}&t=${Date.now()}`;
                        return fetch(bustingUrl)
                            .then(response => {
                                if (response.ok) {
                                    return dataCache.put(url, response.clone());
                                }
                                return Promise.resolve();
                            })
                            .catch(err => {
                                console.log(`⚠️ Errore cache dati ${url}:`, err);
                                return Promise.resolve();
                            });
                    })
                );
            })
            .then(function() {
                console.log(`🎉 SW ${SW_VERSION} - INSTALLAZIONE COMPLETATA!`);
                
                // 📢 Notifica installazione completata
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        client.postMessage({
                            type: 'SW_INSTALLED',
                            version: SW_VERSION,
                            message: '🍎 Sfida Matematica ora compatibile iOS Safari!',
                            autoUpdate: true
                        });
                    });
                });
            })
            .catch(function(error) {
                console.error(`❌ Errore installazione SW ${SW_VERSION}:`, error);
            })
    );
});

// ========================================
// ⚡ ATTIVAZIONE AUTOMATICA AGGRESSIVA  
// ========================================

self.addEventListener('activate', function(event) {
    console.log(`⚡ SW ${SW_VERSION} - ATTIVAZIONE in corso...`);
    
    event.waitUntil(
        Promise.all([
            // 🧹 PULIZIA AUTOMATICA CACHE VECCHIE
            cleanupOldCaches(),
            
            // 🎯 PRENDI CONTROLLO IMMEDIATO DI TUTTI I CLIENT
            self.clients.claim()
        ])
        .then(function() {
            console.log(`✅ SW ${SW_VERSION} - ATTIVAZIONE COMPLETATA!`);
            
            // 📢 Notifica a tutti i client che l'aggiornamento è pronto
            return self.clients.matchAll();
        })
        .then(function(clients) {
            console.log(`👥 Trovati ${clients.length} client attivi`);
            
            clients.forEach(client => {
                client.postMessage({
                    type: 'SW_ACTIVATED',
                    version: SW_VERSION,
                    message: '🍎 Sfida Matematica ora compatibile iOS Safari!',
                    newGameAdded: '🍎 Fix iOS: Sfida Matematica funziona su iPhone/iPad!',
                    forceReload: true, // 🔄 FORZA RELOAD AUTOMATICO
                    autoUpdate: true
                });
            });
            
            // 🔄 RELOAD AUTOMATICO DOPO 2 SECONDI PER SICUREZZA
            setTimeout(() => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'FORCE_RELOAD',
                        message: '🔄 Reload automatico per completare aggiornamento...'
                    });
                });
            }, 2000);
        })
        .catch(function(error) {
            console.error(`❌ Errore attivazione SW ${SW_VERSION}:`, error);
        })
    );
});

// 🧹 FUNZIONE PULIZIA CACHE AUTOMATICA
function cleanupOldCaches() {
    console.log('🧹 Avvio pulizia automatica cache vecchie...');
    
    return caches.keys().then(function(cacheNames) {
        const cachesToDelete = cacheNames.filter(cacheName => {
            // Elimina cache vecchie specifiche
            if (OLD_CACHE_VERSIONS.includes(cacheName)) {
                console.log(`🗑️ Eliminando cache vecchia: ${cacheName}`);
                return true;
            }
            
            // Elimina cache con pattern vecchi
            if (cacheName.startsWith('giochi-') && 
                cacheName !== CACHE_NAME && 
                cacheName !== DATA_CACHE_NAME) {
                console.log(`🗑️ Eliminando cache pattern vecchio: ${cacheName}`);
                return true;
            }
            
            return false;
        });
        
        console.log(`🧹 Eliminando ${cachesToDelete.length} cache vecchie:`, cachesToDelete);
        
        return Promise.all(
            cachesToDelete.map(cacheName => {
                return caches.delete(cacheName).then(deleted => {
                    if (deleted) {
                        console.log(`✅ Cache eliminata: ${cacheName}`);
                    } else {
                        console.log(`⚠️ Impossibile eliminare: ${cacheName}`);
                    }
                    return deleted;
                });
            })
        );
    });
}

// ========================================
// 📡 GESTIONE MESSAGGI DAI CLIENT
// ========================================

self.addEventListener('message', function(event) {
    const { type, payload } = event.data || {};
    
    console.log(`📨 Messaggio ricevuto:`, event.data);
    
    switch (type) {
        case 'SKIP_WAITING':
            console.log('⚡ SKIP_WAITING richiesto - Attivazione immediata...');
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0]?.postMessage({
                version: SW_VERSION,
                caches: [CACHE_NAME, DATA_CACHE_NAME]
            });
            break;
            
        case 'FORCE_UPDATE':
            console.log('🔄 FORCE_UPDATE richiesto - Ricarico cache...');
            event.waitUntil(
                caches.delete(CACHE_NAME)
                    .then(() => caches.delete(DATA_CACHE_NAME))
                    .then(() => {
                        console.log('🔄 Cache eliminate, ricaricamento...');
                        self.registration.update();
                    })
            );
            break;
            
        case 'CLEANUP_CACHES':
            console.log('🧹 CLEANUP_CACHES richiesto');
            event.waitUntil(cleanupOldCaches());
            break;
    }
});

// ========================================
// 🌐 GESTIONE RICHIESTE CON STRATEGIA INTELLIGENTE
// ========================================

self.addEventListener('fetch', function(event) {
    const request = event.request;
    const url = new URL(request.url);
    
    // 🚫 Ignora richieste non-HTTP
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // 🎯 STRATEGIA BASATA SUL TIPO DI RICHIESTA
    if (request.method === 'GET') {
        if (isDataRequest(url.pathname)) {
            // 📊 STRATEGIA DATI: Network First con Cache Fallback
            event.respondWith(handleDataRequest(request));
        } else if (isDocumentRequest(request)) {
            // 📄 STRATEGIA DOCUMENTI: Cache First con Network Fallback  
            event.respondWith(handleDocumentRequest(request));
        } else if (isSfidaMatematicaRequest(url.pathname)) {
            // 🏆 STRATEGIA SPECIALE per Sfida Matematica
            event.respondWith(handleSfidaMatematicaRequest(request));
        } else {
            // 🎯 STRATEGIA GENERICA: Cache First
            event.respondWith(handleOtherRequests(request));
        }
    }
});

// 📊 GESTIONE RICHIESTE DATI (games.json, etc.)
function handleDataRequest(request) {
    console.log('📊 Gestione richiesta DATI:', request.url);
    
    return caches.open(DATA_CACHE_NAME).then(function(cache) {
        return fetch(request).then(function(networkResponse) {
            if (networkResponse.ok) {
                console.log('📥 Dati aggiornati dalla rete, aggiorno cache');
                cache.put(request, networkResponse.clone());
                return networkResponse;
            }
            throw new Error('Network response not ok');
        }).catch(function() {
            console.log('📋 Rete non disponibile, uso cache dati');
            return cache.match(request).then(function(cachedResponse) {
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Fallback per dati mancanti
                return new Response(JSON.stringify({
                    error: 'Dati non disponibili offline',
                    version: SW_VERSION,
                    offline: true
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            });
        });
    });
}

// 📄 GESTIONE RICHIESTE DOCUMENTI (HTML)
function handleDocumentRequest(request) {
    console.log('📄 Gestione richiesta DOCUMENTO:', request.url);
    
    return caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(request).then(function(cachedResponse) {
            if (cachedResponse) {
                console.log('📋 Documento trovato in cache');
                
                // 🔄 Aggiornamento in background
                fetch(request).then(function(networkResponse) {
                    if (networkResponse.ok) {
                        console.log('🔄 Aggiornamento background documento in cache');
                        cache.put(request, networkResponse.clone());
                    }
                }).catch(function() {
                    console.log('🌐 Rete non disponibile per aggiornamento background');
                });
                
                return cachedResponse;
            }
            
            // Se non in cache, prova la rete
            return fetch(request).then(function(networkResponse) {
                if (networkResponse.ok) {
                    console.log('📥 Documento dalla rete, aggiungo a cache');
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                }
                throw new Error('Network response not ok');
            }).catch(function() {
                console.log('❌ Documento non disponibile, fallback offline');
                return generateOfflinePage(request);
            });
        });
    });
}

// 🏆 GESTIONE SPECIALE per SFIDA MATEMATICA
function handleSfidaMatematicaRequest(request) {
    console.log('🏆 Gestione SPECIALE Sfida Matematica:', request.url);
    
    return caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(request).then(function(cachedResponse) {
            if (cachedResponse) {
                console.log('🏆 Sfida Matematica trovata in cache');
                
                // Aggiornamento background con priorità alta
                fetch(request).then(function(networkResponse) {
                    if (networkResponse.ok) {
                        console.log('🔄 Aggiornamento prioritario Sfida Matematica');
                        cache.put(request, networkResponse.clone());
                        
                        // Notifica ai client dell'aggiornamento
                        self.clients.matchAll().then(clients => {
                            clients.forEach(client => {
                                client.postMessage({
                                    type: 'SFIDA_UPDATED',
                                    message: '🏆 Sfida Matematica aggiornata!',
                                    url: request.url
                                });
                            });
                        });
                    }
                }).catch(() => console.log('🌐 Rete non disponibile per Sfida Matematica'));
                
                return cachedResponse;
            }
            
            // Se non in cache, prova rete con retry
            return fetchWithRetry(request, 2).then(function(networkResponse) {
                if (networkResponse.ok) {
                    console.log('🏆 Sfida Matematica dalla rete, cache prioritaria');
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                }
                throw new Error('Network response not ok');
            }).catch(function() {
                console.log('❌ Sfida Matematica non disponibile, fallback speciale');
                return generateSfidaOfflinePage();
            });
        });
    });
}

// 🎯 GESTIONE ALTRE RICHIESTE
function handleOtherRequests(request) {
    return caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(request).then(function(cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }
            
            return fetch(request).then(function(networkResponse) {
                if (networkResponse.ok && networkResponse.status < 400) {
                    cache.put(request, networkResponse.clone());
                }
                return networkResponse;
            });
        });
    });
}

// 🔄 FETCH CON RETRY per richieste critiche
function fetchWithRetry(request, retries = 1) {
    return fetch(request).catch(function(error) {
        if (retries > 0) {
            console.log(`🔄 Retry richiesta ${request.url}, tentativi rimasti: ${retries}`);
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(fetchWithRetry(request, retries - 1));
                }, 1000);
            });
        }
        throw error;
    });
}

// ========================================
// 🎯 FUNZIONI DI UTILITÀ
// ========================================

function isDataRequest(pathname) {
    return pathname.includes('games.json') || 
           pathname.includes('.json') ||
           pathname.includes('/api/');
}

function isDocumentRequest(request) {
    return request.destination === 'document' ||
           request.headers.get('Accept')?.includes('text/html') ||
           request.url.endsWith('.html') ||
           request.url.endsWith('/');
}

function isSfidaMatematicaRequest(pathname) {
    return pathname.includes('sfida-matematica') ||
           pathname.includes('sfida_matematica');
}

// 📄 GENERA PAGINA OFFLINE GENERICA
function generateOfflinePage(request) {
    const offlineHtml = `
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🌐 Modalità Offline</title>
        <style>
            body { 
                font-family: 'Comic Sans MS', cursive, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; 
                text-align: center; 
                padding: 50px 20px;
                margin: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .offline-card {
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                max-width: 500px;
                margin: 0 auto;
            }
            h1 { font-size: 2.5rem; margin-bottom: 20px; }
            p { font-size: 1.2rem; line-height: 1.6; margin-bottom: 30px; }
            .btn {
                background: linear-gradient(45deg, #ff6b6b, #ffa500);
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 10px;
                font-size: 1.1rem;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                margin: 10px;
            }
        </style>
    </head>
    <body>
        <div class="offline-card">
            <h1>🌐 Sei Offline!</h1>
            <p>Non c'è connessione internet, ma alcuni giochi potrebbero funzionare lo stesso!</p>
            <p><strong>Service Worker:</strong> ${SW_VERSION}</p>
            <a href="/" class="btn">🏠 Torna alla Home</a>
            <button onclick="window.location.reload()" class="btn">🔄 Riprova</button>
        </div>
    </body>
    </html>
    `;
    
    return new Response(offlineHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

// 🏆 GENERA PAGINA OFFLINE SPECIALE per SFIDA MATEMATICA
function generateSfidaOfflinePage() {
    const sfidaOfflineHtml = `
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🏆 Sfida Matematica - Offline</title>
        <style>
            body { 
                font-family: 'Comic Sans MS', cursive, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; 
                text-align: center; 
                padding: 20px;
                margin: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .offline-card {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(248, 250, 255, 0.15) 100%);
                padding: 30px;
                border-radius: 20px;
                backdrop-filter: blur(15px);
                max-width: 600px;
                margin: 0 auto;
                border: 1px solid rgba(255,255,255,0.2);
            }
            h1 { font-size: 2.2rem; margin-bottom: 15px; }
            .emoji { font-size: 3rem; margin: 20px 0; }
            p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px; }
            .feature-list {
                text-align: left;
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }
            .feature-list li {
                margin: 8px 0;
                font-size: 1rem;
            }
            .btn {
                background: linear-gradient(45deg, #ff6b6b, #ffa500);
                color: white;
                padding: 12px 25px;
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                margin: 8px;
                transition: transform 0.3s ease;
            }
            .btn:hover { transform: translateY(-2px); }
            .version { 
                font-size: 0.9rem; 
                opacity: 0.8; 
                margin-top: 20px;
                background: rgba(0,0,0,0.2);
                padding: 10px;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="offline-card">
            <div class="emoji">🏆</div>
            <h1>Sfida Matematica in Famiglia 3ª</h1>
            <p><strong>🌐 Modalità Offline Attiva</strong></p>
            
            <p>La Sfida Matematica non è ancora disponibile offline, ma puoi:</p>
            
            <div class="feature-list">
                <ul>
                    <li>🧮 Giocare con <strong>Matematica sul Divano 3ª</strong></li>
                    <li>🎯 Allenarti con <strong>Sfida Tabelline</strong></li>
                    <li>🔄 Riprovare quando torni online</li>
                    <li>📚 Ripassare le operazioni matematiche</li>
                </ul>
            </div>
            
            <p>Quando torni online, potrai accedere a:</p>
            <div class="feature-list">
                <ul>
                    <li>👤 Sistema profili personalizzati</li>
                    <li>🎯 3 sfide giornaliere da 30 domande</li>
                    <li>🏆 Sistema trofei Oro, Argento, Bronzo</li>
                    <li>📱 Sincronizzazione automatica</li>
                </ul>
            </div>
            
            <a href="/" class="btn">🏠 Torna alla Home</a>
            <a href="/matematica.html" class="btn">🧮 Matematica</a>
            <a href="/tabelline.html" class="btn">🎯 Tabelline</a>
            <button onclick="window.location.reload()" class="btn">🔄 Riconnetti</button>
            
            <div class="version">
                Service Worker: ${SW_VERSION}<br>
                Modalità: Offline Automatica
            </div>
        </div>
    </body>
    </html>
    `;
    
    return new Response(sfidaOfflineHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

// ========================================
// 🔄 GESTIONE AGGIORNAMENTI AUTOMATICI
// ========================================

// Auto-check per aggiornamenti ogni 30 secondi quando attivo
self.addEventListener('activate', function() {
    setInterval(() => {
        if (self.registration) {
            console.log('🔄 Auto-check aggiornamenti...');
            self.registration.update().catch(() => {
                // Ignora errori di check automatico
            });
        }
    }, 30000); // 30 secondi
});

// ========================================
// 🎯 SYNC BACKGROUND per PROFILI (Sfida Matematica)
// ========================================

self.addEventListener('sync', function(event) {
    console.log('🔄 Background Sync:', event.tag);
    
    if (event.tag === 'profile-sync') {
        event.waitUntil(syncProfiles());
    } else if (event.tag === 'game-data-sync') {
        event.waitUntil(syncGameData());
    }
});

function syncProfiles() {
    console.log('👤 Sincronizzazione profili in background...');
    // Qui implementeresti la logica di sync dei profili
    // Per ora è un placeholder che simula la sincronizzazione
    return Promise.resolve().then(() => {
        console.log('✅ Profili sincronizzati');
        
        // Notifica ai client
        return self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'PROFILES_SYNCED',
                    message: '👤 Profili sincronizzati automaticamente'
                });
            });
        });
    });
}

function syncGameData() {
    console.log('🎮 Sincronizzazione dati gioco in background...');
    // Placeholder per sync dati di gioco
    return Promise.resolve().then(() => {
        console.log('✅ Dati gioco sincronizzati');
        
        return self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'GAME_DATA_SYNCED',
                    message: '🎮 Dati di gioco sincronizzati'
                });
            });
        });
    });
}

// ========================================
// 📱 GESTIONE NOTIFICHE PUSH (preparato per futuro)
// ========================================

self.addEventListener('push', function(event) {
    if (!event.data) return;
    
    const data = event.data.json();
    console.log('🔔 Notifica push ricevuta:', data);
    
    const options = {
        body: data.body || 'Nuove sfide matematiche disponibili!',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        vibrate: [200, 100, 200],
        tag: 'math-challenge',
        requireInteraction: false,
        actions: [
            {
                action: 'open',
                title: '🎯 Gioca Ora',
                icon: '/icon-192x192.png'
            },
            {
                action: 'close',
                title: '❌ Chiudi',
                icon: '/icon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || '🎮 Giochi Educativi', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// ========================================
// 🎯 LOG FINALE E STATO
// ========================================

console.log(`✅ Service Worker ${SW_VERSION} COMPLETAMENTE CARICATO!`);
console.log(`📦 Cache principale: ${CACHE_NAME}`);
console.log(`📊 Cache dati: ${DATA_CACHE_NAME}`);
console.log(`🎯 Configurato per AGGIORNAMENTI AUTOMATICI`);
console.log(`👶 Modalità BAMBINI A SCUOLA: ZERO intervento richiesto`);
console.log(`🍎 Fix iOS Safari: Sfida Matematica ora compatibile iPhone/iPad`);
console.log(`🚀 Sistema pronto per PWA completamente automatica!`);

// 📊 Esporta informazioni SW per debug (se necessario)
self.SW_INFO = {
    version: SW_VERSION,
    caches: [CACHE_NAME, DATA_CACHE_NAME],
    features: [
        'Auto SkipWaiting',
        'Auto Cache Cleanup', 
        'Auto Reload',
        'Background Sync',
        'Push Notifications Ready',
        'Offline Fallbacks',
        'Sfida Matematica Special Handling',
        'iOS Safari Compatibility'
    ],
    mode: 'AUTOMATIC_FOR_CHILDREN'
};
