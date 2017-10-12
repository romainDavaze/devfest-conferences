(() => {

    'use strict';

        if (!('serviceWorker' in navigator)) {
            console.log('Service worker is not supported'); return;
        }

        navigator.serviceWorker.register('scripts/service-worker.js')
            .then(() => {
                console.log('Service worker subscribing OK');
            })
            .catch(error => {
                console.log('Service worker subscribing KO :', error);
            });


})();