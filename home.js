'use strict';

(() => {

    document.getElementById('btn-sessions').onclick = (() => redirectTo('views/sessions.html'))
    document.getElementById('btn-speakers').onclick =  (() => redirectTo('views/speakers.html'))

    if (!('serviceWorker' in navigator)) {
        console.log('Service worker is not supported'); return;
    }

    navigator.serviceWorker.register('service-worker.js')
        .then(() => {
            console.log('Service worker subscribing OK');
        })
        .catch(error => {
            console.log('Service worker subscribing KO :', error);
        });

    initIndexDB();

})();