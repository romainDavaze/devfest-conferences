(() => {

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