(function () {

const currentSessionStorage = localforage.createInstance({
  name: "current_session",
  storeName: "current_session"
});

const sessionsStorage = localforage.createInstance({
  name: "sessions",
  storeName: "sessions"
})

let current_session;

currentSessionStorage.getItem('session')
.then((value) => current_session = value)
.catch((error) => {
  Throw new Error("Error while getting current session id"));  
} 




})();