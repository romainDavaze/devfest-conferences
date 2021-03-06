'use strict';

(() => {

  $(document).ready(() => {
    $('.button-collapse').sideNav();
  });

  document.getElementById('nav-home').setAttribute('href', '../home.html');
  document.getElementById('nav-calendar').setAttribute('href', '../views/calendar.html');
  document.getElementById('nav-sessions').onclick = (() => $('.button-collapse').sideNav('hide'));
  document.getElementById('nav-speakers').setAttribute('href', '../views/speakers.html');
  document.getElementById('nav-about-device').setAttribute('href', '../views/about-device.html');

  getAllSessions()
    .then(sessions => handleSessions(sessions))
    .catch(error => console.error('Error while fetching sessions data', error));

  function handleSessions(sessions) {

    sessions.sort((a, b) => {
      let ATitle = a.title.toLowerCase();
      let BTitle = b.title.toLowerCase();

      return (ATitle < BTitle) ? -1 : (ATitle > BTitle) ? 1 : 0;
    });

    for (let i in sessions) {
      let parent = document.getElementById('sessions');

      let current = sessions[i];

      let element = document.createElement('a');
      element.className += ' collection-item';

      element.setAttribute('href', '../views/session-detail.html?sessionID=' + current.id);

      element.innerHTML = current.title;

      parent.appendChild(element);
    }
  }

})();

