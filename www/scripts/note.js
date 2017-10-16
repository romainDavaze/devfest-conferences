'use strict';

const sessionID = window.location.search.substring(1).split('=').pop();

(function () {

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {

    document.getElementById('save').onclick = save;
    document.getElementById('btn-take-pic').onclick = takePicture;
    document.getElementById('btn-upload-pic').onclick = uploadPicture;
    document.getElementById('picture').onclick = showPopup;
    document.getElementById('btn-record-audio').onclick = recordAudio;
    document.getElementById('btn-record-video').onclick = recordVideo;


    getSession(sessionID)
      .then(session => {

        getNote(sessionID)
          .then(note => {

            document.getElementById('session-title').innerHTML = session.title;

            if (note) {
              document.getElementById('note').value = note.text;
              document.getElementById('picture').src = note.picture;
              if(note.video) {
                let source = document.getElementById('note-source-video');
                let video  = document.getElementById('note-video');
      
                source.src = note.video.src;
                source.type = note.video.type;
      
                video.load();
                video.hidden = false;

              }
            }
          })
          .catch(error => console.error('Error while trying to get notes from session ' + session.title))
      })
      .catch(error => console.error('Error while trying to get session with ID ' + sessionID))


    function save() {
      saveNote(sessionID, {
        text: document.getElementById('note').value,
        picture: document.getElementById('picture').src,
        video: {
          src: document.getElementById('note-source-video').src,
          type: document.getElementById('note-source-video').type
        }
      });
    }

    function takePicture() {

      navigator.camera.getPicture(
        (image => document.getElementById('picture').src = image),
        (error => console.error('Error while trying to take a picture')),
        {
          quality: 100,
          targetHeight: 400,
          targetWidth: 400,
          sourceType: Camera.PictureSourceType.CAMERA,
          encodingType: Camera.EncodingType.PNG
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
          targetHeight: 400,
          targetWidth: 400,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          encodingType: Camera.EncodingType.PNG
        }
      )

    }

    function handlePopupAction(index) {

      switch (index) {
        case 1:
          getSession(sessionID)
            .then(session => {
              var options = {
                message: 'Here are my notes from the session [ ' + session.title + ' ] taken at Devfest Nantes 2017 : \n\n'
                       + document.getElementById('note').value,
                subject: 'Notes [ ' + session.title + ' ]',
                files: [document.getElementById('picture').src],
                chooserTitle: 'Pick an app'
              }
              window.plugins.socialsharing.shareWithOptions(options);
            })
            .catch(error => console.error('Could not find session with id ' + sessionID, error))
          break;
        case 2:
          document.getElementById('picture').src = '';
          deleteImageFromNote(sessionID);
          break;
        default: window.plugins.actionsheet.hide();
      }
    }

    function showPopup() {
      var options = {
        androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
        title: 'What to do with this picture ?',
        buttonLabels: ['Share note'],
        androidEnableCancelButton: true,
        addCancelButtonWithLabel: 'Cancel',
        addDestructiveButtonWithLabel: 'Delete it',
        position: [20, 40],
        destructiveButtonLast: true
      };

      window.plugins.actionsheet.show(options, handlePopupAction);
    }

    function recordAudio(){

      navigator.device.capture.captureAudio(
        mediaFiles => console.log(mediaFiles),
        //mediaFiles => document.getElementById('note-audio').src = mediaFiles[0].fullPath,
        error => {
          console.log('Error while trying to record audio ', error);
          alert('No default audio recording app is defined on your phone. \n Install one and try again');
        },
        {
          limit: 1,
          duration: 60
        })

    }

    function recordVideo(){

      navigator.device.capture.captureVideo(
        mediaFiles => {

          let source = document.getElementById('note-source-video');
          let video  = document.getElementById('note-video');

          let media = mediaFiles[0];

          source.src = media.fullPath;
          source.type = media.type;

          video.load();
          video.hidden = false;
        },
        //mediaFiles => document.getElementById('note-audio').src = mediaFiles[0].fullPath,
        error => console.error('Error while trying to record video'),
        {
          limit: 1,
          duration: 30
        })

    }

  }




})();
