'use strict';

(() => {

  const DEVFEST_URL = 'https://devfest.gdgnantes.com'

  const sessionID = window.location.search.substring(1).split('=').pop();

  let favoriteSessionSwitch = document.getElementById('add-favorite-session');
  favoriteSessionSwitch.onchange = (() => handleFavoriteSession(favoriteSessionSwitch.checked));

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

    document.getElementById('session-name').innerHTML = currentSession.title;

    if (currentSession.image) {
      document.getElementById('session-pic').src = DEVFEST_URL + currentSession.image;
    } else {
      document.getElementById('session-pic').src = '../assets/logo_devfest.jpg';
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

  function checkFavoriteSession(){
    getFavoriteSession(sessionID)
    .then(favoriteSession => {
      if (favoriteSession){
        favoriteSessionSwitch.checked = true;
      } else {
        favoriteSessionSwitch.checked = false;
      }
    })
  }

  function handleSessionSpeakers(){

    if (sessionSpeakers.length != 0) {
      document.getElementById('speakers').innerHTML = 'Speaker(s) <br/>';
    }

    sessionSpeakers.map(speaker => {

      let speakerParent = document.getElementById('speakers');

      let speakerChild = document.createElement('a');
      speakerChild.innerHTML = speaker.name + '<br/>';
      speakerChild.setAttribute('href', '../views/speaker-detail.html?speakerID=' + speaker.id);

      speakerParent.appendChild(speakerChild);

    })
  }

  function handleFavoriteSession(checked){
    if(checked){
      addFavoriteSession(currentSession, sessionSpeakers);
    } else {
      removeFavoriteSession(sessionID);
    }
  }

})();