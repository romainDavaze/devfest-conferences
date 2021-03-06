'use strict';

const DEVFEST_URL = 'https://devfest.gdgnantes.com'
const sessionID = window.location.search.substring(1).split('=').pop();

(() => {

  $(document).ready(() => {
    $('.button-collapse').sideNav();
  });

  document.getElementById('nav-home').setAttribute('href', '../home.html');
  document.getElementById('nav-calendar').setAttribute('href', '../views/calendar.html');
  document.getElementById('nav-sessions').setAttribute('href', '../views/sessions.html');
  document.getElementById('nav-speakers').setAttribute('href', '../views/speakers.html');
  document.getElementById('nav-about-device').setAttribute('href', '../views/about-device.html');

  let favoriteCheckbox = document.getElementById('add-favorite-session');
  favoriteCheckbox.onchange = (() => handleFavoriteSession(favoriteCheckbox.checked));

  let currentSession;
  let sessionSpeakers;

  getSession(sessionID)
    .then(session => {
      currentSession = session;
      checkFavoriteSession();
      handleSession();
    })
    .catch(error => console.error('Error while fetching session with id ' + sessionID, error))

  function handleSession() {
    let parent = document.getElementById('session');

    if(currentSession.title.length > 35) {
      document.getElementById('session-name').innerHTML = currentSession.title.substring(0, 35) + '...';
    }

    if (currentSession.image) {
      document.getElementById('session-pic').src = DEVFEST_URL + currentSession.image;
    } else {
      document.getElementById('session-pic').src = '../assets/logo-devfest.jpg';
    }

    if (currentSession.description) {
      document.getElementById('session-description').innerHTML = currentSession.description;
    }

    document.getElementById('session-notes').setAttribute('href', '../views/note.html?sessionID=' + currentSession.id);

    getSessionSpeakers(sessionID)
      .then(speakers => {
        sessionSpeakers = speakers;
        handleSessionSpeakers();
      })
      .catch(function (error) {
        console.error('Error while fetching speakers ', error)
      });
  }

  function checkFavoriteSession() {
    getFavoriteSession(sessionID)
      .then(favoriteSession => {
        if (favoriteSession) {
          favoriteCheckbox.checked = true;
        } else {
          favoriteCheckbox.checked = false;
        }
      })
  }

  function handleSessionSpeakers() {
    if (sessionSpeakers.length != 0) {
      document.getElementById('speakers').innerHTML = 'Speaker(s) <br/>';
    }

    sessionSpeakers.map(speaker => {
      let speakerParent = document.getElementById('speakers');

      let speakerChild = document.createElement('a');
      speakerChild.innerHTML = '* ' + speaker.name + '<br/>';
      speakerChild.setAttribute('href', '../views/speaker-detail.html?speakerID=' + speaker.id);

      speakerParent.appendChild(speakerChild);
    })
  }

  function handleFavoriteSession(checked) {
    if (checked) {
      addFavoriteSession(currentSession, sessionSpeakers);
      Materialize.toast(currentSession.title + ' added as favorite to calendar', 3000);
    } else {
      removeFavoriteSession(sessionID);
      Materialize.toast(currentSession.title + ' removed from calendar', 3000);
    }
  }

})();