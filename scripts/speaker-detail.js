'use strict';

(function () {

  const DEVFEST_URL = 'https://devfest.gdgnantes.com'

  let speakerID = window.location.search.substring(1).split('=').pop();


  getSpeaker(speakerID)
    .then(speaker => handleSpeaker(speaker))
    .catch(error => console.error('Error while retrieving speaker with ID ' + speakerID, error))


  function handleSpeaker(speaker) {

    document.getElementById('speaker-name').innerHTML = speaker.name;

    if (speaker.photoUrl) {
      document.getElementById('speaker-pic').src = DEVFEST_URL + speaker.photoUrl;
    } else {
      document.getElementById('speaker-pic').src = '../assets/logo_devfest.jpg';
    }

    if (speaker.bio) {
      document.getElementById('speaker-bio').innerHTML = speaker.bio;
    }

    getSpeakerSessions(speakerID)
      .then(sessions => {
        console.log(sessions)
        let parent = document.getElementById('speaker');

        if (sessions.length != 0) {
          document.getElementById('sessions').innerHTML = 'Session(s) <br/>';
        }

        sessions.map(session => {

          let sessionParent = document.getElementById('sessions');

          let sessionChild = document.createElement('a');
          sessionChild.innerHTML =  session.title + '<br/>';
          sessionChild.setAttribute('href', '/views/session-detail.html?sessionID=' + session.id);

          sessionParent.appendChild(sessionChild);

        });

      })
      .catch(function (error) {
        console.error('Error while fetching sessions for speaker ' + speaker.name, error);
      });


  }



})();