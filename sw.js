/* ==========================================
   SERVICE WORKER - PWA Offline Support
   Enhanced caching strategies for better performance
   ========================================== */

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `ticuv-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `ticuv-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `ticuv-images-${CACHE_VERSION}`;

// Core assets that should be cached immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/js/theme.js',
    '/js/portfolio.js',
    '/js/modal.js',
    '/js/navigation.js',
    '/js/animations.js',
    '/js/forms.js',
    '/js/cookie.js',
    '/js/ui.js',
    '/js/improvements.js',
    '/logo.png',
    '/ticuv.jpg',
    '/favicon.ico',
    '/site.webmanifest'
];

// Image cache size limit
const IMAGE_CACHE_LIMIT = 50;

// Helper to limit cache size
async function limitCacheSize(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
        await cache.delete(keys[0]);
        return limitCacheSize(cacheName, maxItems);
    }
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[ServiceWorker] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[ServiceWorker] Installed successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[ServiceWorker] Installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activating...');

    const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (!currentCaches.includes(cacheName)) {
                            console.log('[ServiceWorker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[ServiceWorker] Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - different strategies for different content types
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Handle Cloudinary images - Cache First with network fallback
    if (url.hostname === 'res.cloudinary.com') {
        event.respondWith(
            caches.open(IMAGE_CACHE).then(async (cache) => {
                const cachedResponse = await cache.match(request);
                if (cachedResponse) return cachedResponse;

                const networkResponse = await fetch(request);
                if (networkResponse.ok) {
                    cache.put(request, networkResponse.clone());
                    limitCacheSize(IMAGE_CACHE, IMAGE_CACHE_LIMIT);
                }
                return networkResponse;
            }).catch(() => {
                // Return placeholder for failed images
                return new Response('', { status: 404 });
            })
        );
        return;
    }

    // Handle Google Fonts - Cache First
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(
            caches.open(DYNAMIC_CACHE).then(async (cache) => {
                const cachedResponse = await cache.match(request);
                if (cachedResponse) return cachedResponse;

                const networkResponse = await fetch(request);
                if (networkResponse.ok) {
                    cache.put(request, networkResponse.clone());
                }
                return networkResponse;
            })
        );
        return;
    }

    // Skip other external requests
    if (!url.origin.includes(self.location.origin)) return;

    // Handle local assets - Stale While Revalidate
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const cacheName = request.destination === 'image' ? IMAGE_CACHE : STATIC_CACHE;
                    caches.open(cacheName).then((cache) => {
                        cache.put(request, networkResponse.clone());
                    });
                }
                return networkResponse;
            }).catch(() => null);

            return cachedResponse || fetchPromise;
        }).then((response) => {
            if (response) return response;

            // Fallback for navigation requests
            if (request.mode === 'navigate') {
                return caches.match('/index.html');
            }

            return new Response('Offline', { status: 503 });
        })
    );
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
