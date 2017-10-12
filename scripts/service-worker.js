importScripts("../vendors/js/localforage.js");


const speakersStorage = localforage.createInstance({
  name: "current_session",
  storeName: "current_session"
});

const sessionsStorage = localforage.createInstance({
  name: "sessions",
  storeName: "sessions"
})

self.addEventListener('install', event => {
    console.log('Service Worker install...');
    console.log('Data is being put in cache...');
    event.waitUntil(
        Promise.all([
            caches.open(sessionsStorage.storeName)
                .then(cache => {
                    console.log("Sessions storage created");
                }),
            fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/sessions.json')
                .then(resp => resp.json())
                .then(sessions => {
                    for (key in sessions) {
                        sessionsStorage.setItem(key, sessions[key])
                    }
                })
        ]
        )
    )
    event.waitUntil(
        Promise.all([
            caches.open(speakersStorage.storeName)
                .then(cache => {
                    console.log("Speakers storage created");
                }),
            fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/speakers.json')
                .then(resp => resp.json())
                .then(speakers => {
                    for (key in speakers) {
                        speakersStorage.setItem(key, speakers[key])
                    }
                })
        ]
        )
    )
});

self.addEventListener('activate', event => {
    console.log('Activating new service worker...');
    const cacheWhitelist = [speakersStorage, sessionsStorage];

    caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
                if (cacheWhitelist.indexOf(cacheName) < 0) {
                    return caches.delete(cacheName);
                }
            }));
    });
});

self.skipWaiting();

self.addEventListener('fetch', event => {

    if(event.request.url.indexOf('sessions.json') > 0) {

        event.respondWith(

            caches.has(sessionsStorage.storeName).then(response => {
                let sessions = [];
                if(response){
                    sessionsStorage.iterate((value, key, iterationNumber) => {
                        sessions.push({
                            key : value
                        })
                    })
                    .then(() => { return sessions; })
                    .catch( error => console.log('error while getting sessions from cache'))
                } else {

                    return fetch(event.request).then(response => {
                        if(response.ok) {
                            caches.open(sessionsStorage.storeName)
                            .then(cache => {
                                console.log("Sessions storage created");
                            }),
                            fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/sessions.json')
                            .then(resp => resp.json())
                            .then(sessions => {
                                for (key in sessions) {
                                    sessionsStorage.setItem(key, sessions[key])
                                }
                            })
                            return response;
                        }
                    })

                }

            })

        )
    } else if (event.request.url.indexOf('speakers.json') > 0) {

        event.respondWith(
            
            caches.has(speakersStorage.storeName).then(response => {
                let speakers = [];
                if(response){
                    speakersStorage.iterate((value, key, iterationNumber) => {
                        speakers.push({
                            key : value
                        })
                    })
                    .then(() => { return speakers; })
                    .catch( error => console.log('error while getting speakers from cache'))
                } else {

                    return fetch(event.request).then(response => {
                        if(response.ok) {
                            caches.open(speakersStorage.storeName)
                            .then(cache => {
                                console.log("Speakers storage created");
                            }),
                            fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/speakers.json')
                            .then(resp => resp.json())
                            .then(speakers => {
                                for (key in speakers) {
                                    speakersStorage.setItem(key, speakers[key])
                                }
                            })
                            return response;
                        }
                    })

                }

            })

        ) 

    }
    return fetch(event.request);
    
});
