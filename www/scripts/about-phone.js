(() => {

  document.addEventListener("deviceready", onDeviceReady, false);
  
  function onDeviceReady() {
      // Now safe to use device APIs
      let platform   = document.getElementById('platform');
      let version    = document.getElementById('version');
      let uuid       = document.getElementById('uuid');
      let model      = document.getElementById('model');
      let connection = document.getElementById('connection');
    
      platform.innerHTML   = device.platform;
      version.innerHTML    = device.version;
      uuid.innerHTML       = device.uuid;
      model.innerHTML      = device.model;
      connection.innerHTML = navigator.connection.type;
  }



})();