(function (){
    // const currentSessionStorage = localforage.createInstance({
    //   name: "current_session",
    //   storeName: "current_session"
    // });
    
    // const sessionsStorage = localforage.createInstance({
    //   name: "speakers",
    //   storeName: "speakers"
    // })  
  
    fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/speakers.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        parseSpeakersData(json);
      })
      .catch(function (error) {
        console.error('Error while fetching speakers data', error);
      });
    
    function parseSpeakersData(data) {
      for (i in data) {
  
        let parent = document.getElementById('speakers');
    
        let current = data[i];
    
        let div = document.createElement('div');
    
        let element = document.createElement('a');
    
        element.setAttribute('href','/views/speaker-detail.html?speakerID='+current.id);

        element.innerHTML = current.name;
    
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

  
  })();
  
  