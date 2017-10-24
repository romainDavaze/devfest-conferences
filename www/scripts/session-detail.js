'use strict';

(function () {

  const DEVFEST_URL = 'https://devfest.gdgnantes.com'

  const sessionID = window.location.search.substring(1).split('=').pop();

  getSession(sessionID)
    .then(session => handleSession(session))
    .catch(error => console.error('Error while fetching session with id ' + sessionID, error))

  function handleSession(session) {

    let parent = document.getElementById('session');

    document.getElementById('session-name').innerHTML = session.title;

    if (session.image) {
      document.getElementById('session-pic').src = DEVFEST_URL + session.image;
    } else {
      document.getElementById('session-pic').src = '../assets/logo_devfest.jpg';
    }

    if (session.description) {
      document.getElementById('session-description').innerHTML = session.description;
    }

    document.getElementById('session-notes').setAttribute('href', '../views/note.html?sessionID=' + session.id);


    getSessionSpeakers(sessionID)
      .then(speakers => {

        if (speakers.length != 0) {
          document.getElementById('speakers').innerHTML = 'Speaker(s) <br/>';
        }

        speakers.map(speaker => {

          let speakerParent = document.getElementById('speakers');

          let speakerChild = document.createElement('a');
          speakerChild.innerHTML = speaker.name + '<br/>';
          speakerChild.setAttribute('href', '../views/speaker-detail.html?speakerID=' + speaker.id);

          speakerParent.appendChild(speakerChild);

        })

      })

      .catch(function (error) {
        console.error('Error while fetching speakers ', error)
      });
  }


})();