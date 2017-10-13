'use strict';

const sessionID = window.location.search.substring(1).split('=').pop();

(function () {

  document.getElementById('save').onclick = save;


  getSession(sessionID)
    .then(session => {

      getNote(sessionID)
        .then(note => {
          
          document.getElementById('session-title').innerHTML = session.title;
      
          if(note) {
            document.getElementById('note').value = note.text;
          }
      })
    .catch(error => console.error('Error while trying to get notes from session ' +session.title))
  })
  .catch(error => console.error('Error while trying to get session with ID ' + sessionID))


  function save() {
    saveNote(sessionID, {
      text: document.getElementById('note').value
    });
  }
  

})();

