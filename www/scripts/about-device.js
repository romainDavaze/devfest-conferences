(() => {

  $(document).ready(function(){
    $('.button-collapse').sideNav();
  });
  
  document.getElementById('nav-home').setAttribute('href', '../home.html');
  document.getElementById('nav-calendar').setAttribute('href', '../views/calendar.html');
  document.getElementById('nav-sessions').setAttribute('href', '../views/sessions.html');
  document.getElementById('nav-speakers').setAttribute('href', '../views/speakers.html');
  document.getElementById('nav-about-device').onclick = (() => $('.button-collapse').sideNav('hide'));

  document.addEventListener("deviceready", onDeviceReady, false);

  let platform = document.getElementById('platform');
  let version = document.getElementById('version');
  let uuid = document.getElementById('uuid');
  let model = document.getElementById('model');
  let connection = document.getElementById('connection');

  function onDeviceReady() {

    platform.innerHTML = device.platform;
    version.innerHTML = device.version;
    uuid.innerHTML = device.uuid;
    model.innerHTML = device.model;
    connection.innerHTML = navigator.connection.type.toUpperCase();
  }

})();