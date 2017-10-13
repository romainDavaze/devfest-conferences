'use strict';

(() => {

  getAllSpeakers()
    .then(speakers => handleSpeakers(speakers))
    .catch(error => console.error('Error while fetching speakers data', error));

  function handleSpeakers(speakers) {
    for (let i in speakers) {

      let parent = document.getElementById('speakers');

      let current = speakers[i];

      let div = document.createElement('div');

      let element = document.createElement('a');

      element.setAttribute('href', '/views/speaker-detail.html?speakerID=' + current.id);

      element.innerHTML = current.name;

      div.appendChild(element);

      parent.appendChild(div);

    }
  }


})();

