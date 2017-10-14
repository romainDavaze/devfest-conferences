'use strict';

const sessionID = window.location.search.substring(1).split('=').pop();

(function () {

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {

    document.getElementById('save').onclick = save;
    document.getElementById('btn-take-pic').onclick = takePicture;
    document.getElementById('btn-upload-pic').onclick = uploadPicture;


    getSession(sessionID)
      .then(session => {

        getNote(sessionID)
          .then(note => {

            document.getElementById('session-title').innerHTML = session.title;

            if (note) {
              document.getElementById('note').value = note.text;
              document.getElementById('picture').src = note.picture;
            }
          })
          .catch(error => console.error('Error while trying to get notes from session ' + session.title))
      })
      .catch(error => console.error('Error while trying to get session with ID ' + sessionID))


    function save() {
      saveNote(sessionID, {
        text: document.getElementById('note').value,
        picture : document.getElementById('picture').src
      });
    }

    function takePicture(){

      navigator.camera.getPicture(
        (image => document.getElementById('picture').src = image),
        (error => console.error('Error while trying to take a picture')),
        {
          quality: 100,
          targetHeight: 200,
          targetWidth: 200,
          sourceType: Camera.PictureSourceType.CAMERA,
          encodingType : Camera.EncodingType.PNG
        }
      )

    }

    function uploadPicture() {

      navigator.camera.getPicture(
        (image => {
          document.getElementById('picture').src = image;
        }),
        (error => console.error('Error while trying to take a picture')),
        {
          quality: 100,
          targetHeight: 200,
          targetWidth: 200,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          encodingType : Camera.EncodingType.PNG
        }
      )

    }

  }


})();

