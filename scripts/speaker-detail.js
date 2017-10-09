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
    
      fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/speakers.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        let parent = document.getElementById('speaker');
    
        let speakers = [];
        for (i in json){
          speakers[i] = json[i];
        }
    
        let speakerID = window.location.search.substring(1).split('=').pop();
    
        let speaker = speakers.filter(speaker => speaker.id == speakerID)[0];
    
        document.getElementById('speaker-name').innerHTML = speaker.name;
    
        if(speaker.photoUrl) {
          document.getElementById('speaker-pic').src = DEVFEST_URL + speaker.photoUrl;
        } else {
          document.getElementById('speaker-pic').src = '../assets/logo_devfest.jpg';
        }
        
        if(speaker.bio) {
          document.getElementById('speaker-bio').innerHTML = speaker.bio;
        }
    
        fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/sessions.json')
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          let sessions = [];
          for (i in json){
            sessions[i] = json[i];
          }
          
          let filteredSessions = sessions.filter(session => "speakers" in session)


          filteredSessions.map(session => console.log(session.speakers + ' ' +(session.speakers.includes(speakerID)) + ' ' + speakerID))

          for(i in filteredSessions) {
            
            let sessionSpeakers = [];

            for(y in filteredSessions[i].speakers){
                
                let sessionParent = document.getElementById('sessions');
        
                let sessionChild = document.createElement('a');
                sessionChild.innerHTML = filteredSessions[i].title + '<br/>';
                sessionChild.setAttribute('href', '/views/session-detail.html?sessionID='+filteredSessions[i].speakers[y]);
        
                sessionParent.appendChild(sessionChild);

            }
            
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