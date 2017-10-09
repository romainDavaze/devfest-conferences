(function () {


// const currentSessionStorage = localforage.createInstance({
//   name: "current_session",
//   storeName: "current_session"
// });

// const sessionsStorage = localforage.createInstance({
//   name: "sessions",
//   storeName: "sessions"
// })

const DEVFEST_URL = 'https://devfest.gdgnantes.com'

//currentSessionStorage.getItem('session')
//.then((value) => {

  fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/sessions.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    let parent = document.getElementById('session');

    let sessions = [];
    for (i in json){
      sessions[i] = json[i];
    }

    let sessionID = window.location.search.substring(1).split('=').pop();

    let session = sessions.filter(session => session.id == sessionID)[0];

    document.getElementById('session-name').innerHTML = session.title;

    if(session.image) {
      document.getElementById('session-pic').src = DEVFEST_URL + session.image;
    } else {
      document.getElementById('session-pic').src = '../assets/logo_devfest.jpg';
    }
    
    if(session.description) {
      document.getElementById('session-description').innerHTML = session.description;
    }

    fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/speakers.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      let speakers = [];
      for (i in json){
        speakers[i] = json[i];
      }
      
      for(i in session.speakers) {

        let speaker = speakers.filter(speaker => speaker.id == session.speakers[i]).pop();
        
        let speakerParent = document.getElementById('speakers');

        let speakerChild = document.createElement('a');
        speakerChild.innerHTML = speaker.name + '<br/>';
        speakerChild.setAttribute('href', '/views/speaker-detail.html?speakerID='+speaker.id);

        speakerParent.appendChild(speakerChild);
        
      }


    })
    .catch(function (error) {
      console.error('Error while fetching speakers ', error)
    });

  })
  .catch(function (error) {
    console.error('Error while fetching sessions data', error);
  });
// })
// .catch((error) => console.error("Error while getting current session id"))


})();