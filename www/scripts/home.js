'use strict';

var app = {

    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function () {
        this.initHome('deviceready');
    },

    initHome: (id) => {

        document.getElementById('btn-sessions').onclick = (() => redirectTo('views/sessions.html'));
        document.getElementById('btn-speakers').onclick = (() => redirectTo('views/speakers.html'));
        document.getElementById('btn-calendar').onclick = (() => redirectTo('views/calendar.html'));
        document.getElementById('btn-about').onclick = (() => redirectTo('views/about-device.html'));
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

    }
};

app.initialize();

