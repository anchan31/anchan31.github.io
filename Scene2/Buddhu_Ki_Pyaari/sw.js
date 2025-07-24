const CACHE_NAME = 'birthday-v1';
const urlsToCache = [
    '/',
    '/style.css',
    '/script.js',
    '/Images/1.webp',
    '/Images/3.webp'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
