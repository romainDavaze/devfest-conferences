'use strict';

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.initHome('deviceready');
    },

    initHome: (id) => {

        document.getElementById('btn-sessions').onclick = (() => redirectTo('views/sessions.html'))
        document.getElementById('btn-speakers').onclick = (() => redirectTo('views/speakers.html'))
        document.getElementById('btn-about').onclick = (() => redirectTo('views/about-phone.html'))

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

