(function (){
  // const currentSessionStorage = localforage.createInstance({
  //   name: "current_session",
  //   storeName: "current_session"
  // });
  
  // const sessionsStorage = localforage.createInstance({
  //   name: "sessions",
  //   storeName: "sessions"
  // })  

  fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/sessions.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      parseSessionsData(json);
    })
    .catch(function (error) {
      console.error('Error while fetching sessions data', error);
    });
  
  function parseSessionsData(data) {
    for (i in data) {

      let parent = document.getElementById('sessions');
  
      let current = data[i];
  
      let div = document.createElement('div');
  
      let element = document.createElement('a');
  
      element.setAttribute('href','/views/session-detail.html?sessionID='+current.id);
      //element.setAttribute('onclick','setSessionID('+current.id+')');
      element.innerHTML = current.title;
  
      div.appendChild(element);
  
      parent.appendChild(div);

      // sessionsStorage.setItem(parseInt(current.id), {
      //   id: parseInt(current.id),
      //   title: current.title,
      //   description: current.description,
      //   speakers: current.speakers
      // })
    }
  }
  
  // function setSessionID(id){
  //   currentSessionStorage.setItem('session', id);
  // }

})();

