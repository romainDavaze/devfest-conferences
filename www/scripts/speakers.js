'use strict';

(() => {

  $(document).ready(function(){
    $('.button-collapse').sideNav();
  });
  
  document.getElementById('nav-home').setAttribute('href', '../home.html');
  document.getElementById('nav-calendar').setAttribute('href', '../views/calendar.html');
  document.getElementById('nav-sessions').setAttribute('href', '../views/sessions.html');
  document.getElementById('nav-speakers').onclick = (() => $('.button-collapse').sideNav('hide'));
  document.getElementById('nav-about-device').setAttribute('href', '../views/about-device.html');

  getAllSpeakers()
    .then(speakers => handleSpeakers(speakers))
    .catch(error => console.error('Error while fetching speakers data', error));

  function handleSpeakers(speakers) {
    for (let i in speakers) {

      let parent = document.getElementById('speakers');

      let current = speakers[i];

      let element = document.createElement('a');
      element.className += ' collection-item';

      element.setAttribute('href', '../views/speaker-detail.html?speakerID=' + current.id);

      element.innerHTML = current.name;

      parent.appendChild(element);

    }
  }


})();

