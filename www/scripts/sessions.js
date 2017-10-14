'use strict';

(function (){

  getAllSessions()
    .then(sessions => handleSessions(sessions))
    .catch(error => console.error('Error while fetching sessions data', error));
  
  function handleSessions(sessions) {
    for (let i in sessions) {

      let parent = document.getElementById('sessions');
  
      let current = sessions[i];
  
      let div = document.createElement('div');
  
      let element = document.createElement('a');
  
      element.setAttribute('href','../views/session-detail.html?sessionID='+current.id);

      element.innerHTML = current.title;
  
      div.appendChild(element);
  
      parent.appendChild(div);
    }
  }
  

})();

