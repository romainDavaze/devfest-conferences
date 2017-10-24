'use strict';

const sessionID = window.location.search.substring(1).split('=').pop();

const DEFAULT_PIC = '../assets/default-pic.png';

(() => {

  document.addEventListener("deviceready", onDeviceReady, false);

  document.getElementById('save-note').onclick = save;
  document.getElementById('share-note').onclick = shareNote;
  document.getElementById('btn-take-pic').onclick = takePicture;
  document.getElementById('btn-upload-pic').onclick = uploadPicture;
  document.getElementById('pic1').onclick = (() => showPopup(1));
  document.getElementById('pic2').onclick = (() => showPopup(2));
  document.getElementById('pic3').onclick = (() => showPopup(3));
  document.getElementById('pic4').onclick = (() => showPopup(4));
  document.getElementById('btn-record-audio').onclick = recordAudio;
  document.getElementById('btn-record-video').onclick = recordVideo;

  let pictures = [];
  let picIndex = 0;
  let selectedPicID;

  function onDeviceReady() {

    getSession(sessionID)
      .then(session => {

        getNote(sessionID)
          .then(note => {

            document.getElementById('session-name').innerHTML = session.title;

            if (note) {
              document.getElementById('note').value = note.text;

              if (note.pictures) {
                for (var index = 0; index < note.pictures.length; index++) {
                  document.getElementById('pic' + (index + 1)).src = note.pictures[index];
                  pictures.push(note.pictures[index]);
                  picIndex++;
                }
              }

              if (note.video) {
                let source = document.getElementById('note-source-video');
                let video = document.getElementById('note-video');

                source.src = note.video.src;
                source.type = note.video.type;

                video.load();
                video.hidden = false;

              }

              if (note.audio) {
                let source = document.getElementById('note-source-audio');
                let audio = document.getElementById('note-audio');

                source.src = note.audio.src;
                source.type = note.audio.type;

                audio.load();
                audio.hidden = false;
              }
            }

            for (var index = pictures.length; index < 4; index++) {
              document.getElementById('pic' + (index + 1)).src = DEFAULT_PIC;
              pictures.push(DEFAULT_PIC);
            }

          })
          .catch(error => console.error('Error while trying to get notes from session ' + session.title, error))
      })
      .catch(error => console.error('Error while trying to get session with ID ' + sessionID, error))




  }

  function save() {
    let data = {
      text: document.getElementById('note').value,
      pictures: pictures,
    };

    let videoSource = document.getElementById('note-source-video');

    if (videoSource.src != "" && videoSource.type != "") {
      data.video = {
        src: videoSource.src,
        type: videoSource.type
      }
    }

    let audioSource = document.getElementById('note-source-audio');

    if (audioSource.src != "" && audioSource.type != "") {
      data.audio = {
        src: audioSource.src,
        type: audioSource.type
      }
    }

    saveNote(sessionID, data);
  }

  function shareNote() {

    let files = pictures.filter(pic => pic != DEFAULT_PIC).filter(pic => !pic.startsWith('content'));

    // if (device.model = "Android") {
    //   files.map(file => {
    //     window.FilePath.resolveNativePath(file,
    //       (path => path),
    //       (error => console.error('Could not retrieve native URL for file ' + file, error)))
    //   }
    //   );
    // }

    getSession(sessionID)
      .then(session => {
        var options = {
          message: 'Here are my notes from the session [ ' + session.title + ' ] taken at Devfest Nantes 2017 : \n\n'
          + document.getElementById('note').value,
          subject: 'Notes [ ' + session.title + ' ]',
          files: files,
          chooserTitle: 'Pick an app'
        }
        window.plugins.socialsharing.shareWithOptions(options);
      })
      .catch(error => console.error('Could not find session with id ' + sessionID, error))
  }

  function takePicture() {

    navigator.camera.getPicture(
      (image => {
        if (picIndex < 4) {
          document.getElementById('pic' + (picIndex + 1)).src = image;
          pictures[picIndex] = image;
          picIndex++;
        }
        else {
          document.getElementById('pic1').src = image;
          pictures[0] = image;
          picIndex = 1;
        }
      }),
      (error => console.error('Error while trying to take a picture', error)),
      {
        quality: 100,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.PNG,
        destinationType: Camera.DestinationType.FILE_URI
      }
    )

  }

  function uploadPicture() {

    navigator.camera.getPicture(
      (image => {
        if (picIndex < 4) {
          document.getElementById('pic' + (picIndex + 1)).src = image;
          pictures[picIndex] = image;
          picIndex++;
        }
        else {
          document.getElementById('pic1').src = image;
          pictures[0] = image;
          picIndex = 1;
        }
      }),
      (error => console.error('Error while trying to take a picture', error)),
      {
        quality: 100,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.PNG,
        destinationType: Camera.DestinationType.FILE_URI
      }
    )

  }

  function handlePopupAction(index) {
    switch (index) {
      case 1:
        deleteImageFromNote(sessionID, document.getElementById('pic' + selectedPicID).src, DEFAULT_PIC);
        document.getElementById('pic' + selectedPicID).src = DEFAULT_PIC;
        pictures[selectedPicID - 1] = DEFAULT_PIC;
        picIndex = selectedPicID - 1;
        break;
      default: window.plugins.actionsheet.hide();
    }
  }

  function showPopup(id) {

    if (document.getElementById('pic' + id).src.indexOf('default-pic.png') < 0) {
      selectedPicID = id;

      var options = {
        androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
        title: 'Do you want to delete this picture ?',
        androidEnableCancelButton: true,
        buttonLabels: ['Yes, I do', 'No, please don\'t'],
        position: [20, 40],
        destructiveButtonLast: true
      };

      window.plugins.actionsheet.show(options, handlePopupAction);
    }

  }

  function recordAudio() {

    navigator.device.capture.captureAudio(
      mediaFiles => {
        alert('toto');
        let source = document.getElementById('note-source-audio');
        let audio = document.getElementById('note-audio');

        let media = mediaFiles[0];

        source.src = media.fullPath;
        source.type = media.type;

        audio.load();
        audio.hidden = false;
      },
      error => {
        console.log('Error while trying to record audio ', error);
        alert('No default audio recording app is defined on your phone. \n Install one and try again');
      },
      {
        limit: 1,
        duration: 60
      })

  }

  function recordVideo() {

    navigator.device.capture.captureVideo(
      mediaFiles => {

        let source = document.getElementById('note-source-video');
        let video = document.getElementById('note-video');

        let media = mediaFiles[0];

        source.src = media.fullPath;
        source.type = media.type;

        video.load();
        video.hidden = false;
      },

      error => console.error('Error while trying to record video'),
      {
        limit: 1,
        duration: 30
      })

  }



})();
