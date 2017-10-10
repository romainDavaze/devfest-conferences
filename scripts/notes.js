let sessionID = window.location.search.substring(1).split('=').pop();
let DATA_URL = 'http://localhost:3000/notes/';
let currentNote;

(function (){

  fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/sessions.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {

    let sessions = [];
    for (i in json){
      sessions[i] = json[i];
    }

    let session = sessions.filter(session => session.id == sessionID).pop();

    document.getElementById('session-title').innerHTML = session.title;

    fetch(DATA_URL)
    .then(response => response.json())
    .then(json => {
      let notes = [];
      for (i in json){
        notes[i] = json[i];
      }

      let contentElem = document.getElementById('note');
      currentNote = notes.filter(note => note.id == sessionID).pop();

      if(currentNote){
        contentElem.innerHTML = currentNote.text;
      }
    })
    .catch(error => console.error('Error while trying to get notes data '))
  })
  .catch(error => console.error('Error while trying to get sessions data '))


})();

function saveNote(){
  fetch(DATA_URL)
  .then(function(data){
      return data.json();
  })
  .then(function(json){

    let text = document.getElementById('note').value;

    if(currentNote){
      fetch(DATA_URL + currentNote.id, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          'text': text
        })
      })
    } else {
      fetch(DATA_URL, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          'id': sessionID,
          'text': text
        })
      })
    }

  })
  .catch(function(error){
      console.error(error);
  })
}
