importScripts("vendors/js/localforage.js");


const FILES_TO_CACHE = [
    'home.html',
    'home.js',
    'service-worker.js',
    'views/notes.html',
    'views/session-detail.html',
    'views/sessions.html',
    'views/speaker-detail.html',
    'views/speakers.html',
    'scripts/cache-service.js',
    'scripts/notes.js',
    'scripts/session-detail.js',
    'scripts/sessions.js',
    'scripts/speaker-detail.js',
    'scripts/speakers.js',
    'scripts/utils.js',
    'vendors/css/material-icons.css',
    'vendors/css/materialize.css',
    'vendors/js/jquery.min.js',
    'vendors/js/localforage.js',
    'vendors/js/materialize.js',
    'vendors/fonts/roboto/Roboto-Regular.woff2',
    'assets/logo_devfest.jpg'

];

const STATIC_CACHE_NAME = 'devfest-conferences-pages';


self.addEventListener('install', event => {

    console.log('Installing Service Worker...');

    console.log('Putting resources in cache');

    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE_NAME)
                .then(cache => cache.addAll(FILES_TO_CACHE))
        ])

    );
});

self.skipWaiting();

self.addEventListener('activate', event => {
    console.log('Activating Service Worker...');

    // const cacheWhiteList = [STATIC_CACHE_NAME];

    // event.waitUntil(
    //     caches.keys().then(cachesNames => {
    //         return Promise.all(
    //             cachesNames.map(cacheName => {
    //                 if (cacheWhiteList.indexOf(cacheName) < 0) {
    //                     return caches.delete(cacheName);
    //                 }
    //             })
    //         )
    //     })
    // )
})


self.addEventListener('fetch', event => {

    console.log('Fetching:', event.request.url);

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log(event.request.url, ' served by cache');
                    return response;
                }
                console.log(event.request.url, ' served by internet');
                return fetch(event.request);

            })
            .then(function (response) {
                return caches.open(STATIC_CACHE_NAME).then(cache => {

                    if (event.request.url.indexOf('.json') < 0) {
                        cache.put(event.request.url, response.clone());
                    }

                    return response;
                })
            })
            .catch(error => console.error("Error while getting " + event.request))
    );

});
