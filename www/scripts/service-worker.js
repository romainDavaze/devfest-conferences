importScripts("../vendors/js/localforage.js");


const FILES_TO_CACHE = [
    '../home.html',
    '../views/note.html',
    '../views/session-detail.html',
    '../views/sessions.html',
    '../views/speaker-detail.html',
    '../views/speakers.html',
    'home.js',
    'service-worker.js',
    'cache-service.js',
    'note.js',
    'session-detail.js',
    'sessions.js',
    'speaker-detail.js',
    'speakers.js',
    'utils.js',
    '../styles/about-device.css',
    '../styles/home.css',
    '../styles/note.css',
    '../styles/session-detail.css',
    '../styles/sessions.css',
    '../styles/speaker-detail.css',
    '../styles/speakers.css',
    '../vendors/css/material-icons.css',
    '../vendors/css/materialize.css',
    '../vendors/js/jquery.min.js',
    '../vendors/js/localforage.js',
    '../vendors/js/materialize.js',
    '../vendors/fonts/roboto/Roboto-Regular.woff2',
    '../assets/logo_devfest.jpg'

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
