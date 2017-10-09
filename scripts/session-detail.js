(function () {

const currentSessionStorage = localforage.createInstance({
  name: "current_session",
  storeName: "current_session"
});

const sessionsStorage = localforage.createInstance({
  name: "sessions",
  storeName: "sessions"
})

const DEVFEST_URL = 'https://devfest.gdgnantes.com'

currentSessionStorage.getItem('session')
.then((value) => {

  fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/sessions.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    let parent = document.getElementById('session');

    let session = json.filter(session => session.id == value);

    let hello = document.createElement('h1');
    hello = session.title;
    document.getElementById('session-name').innerHTML = session.title;
    document.getElementById('session-pic').src = DEVFEST_URL + session.image;
    document.getElementById('session-description').innerHTML = session.description;

    console.log('toto')
    parent.appendChild(hello);
  })
  .catch(function (error) {
    console.error('Error while fetching sessions data', error);
  });
})
.catch((error) => console.error("Error while getting current session id"))




})();