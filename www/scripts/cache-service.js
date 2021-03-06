'use strict';

const speakersStorage = localforage.createInstance({
  name: 'speakers',
  storeName: 'speakers'
});

const sessionsStorage = localforage.createInstance({
  name: 'sessions',
  storeName: 'sessions'
})

const notesStorage = localforage.createInstance({
  name: 'notes',
  storeName: 'notes'

})

const scheduleStorage = localforage.createInstance({
  name: 'schedule',
  storeName: 'schedule'
})

const calendarStorage = localforage.createInstance({
  name: 'calendar',
  storeName: 'calendar'
})


const DATA_START_URL = 'https://raw.githubusercontent.com/DevInstitut/conference-data/master/'


function initIndexDB() {

  Promise.all([
    caches.open(sessionsStorage.storeName)
      .then(cache => {
        console.log("Sessions storage created");
      }),
    fetch(DATA_START_URL + 'sessions.json')
      .then(resp => resp.json())
      .then(sessions => {
        for (let key in sessions) {
          sessionsStorage.setItem(key, sessions[key]);
        }
      })
  ]
  )

  Promise.all([
    caches.open(speakersStorage.storeName)
      .then(cache => {
        console.log("Speakers storage created");
      }),
    fetch(DATA_START_URL + 'speakers.json')
      .then(resp => resp.json())
      .then(speakers => {
        for (let key in speakers) {
          speakersStorage.setItem(key, speakers[key]);
        }
      })
  ]
  )

  Promise.all([
    caches.open(scheduleStorage.storeName)
      .then(cache => {
        console.log("Schedule storage created");
      }),
    fetch(DATA_START_URL + 'schedule.json')
      .then(resp => resp.json())
      .then(days => {
        for (let key in days) {
          scheduleStorage.setItem(key, days[key]);
        }
      })
  ]
  )

}

function getAllSessions() {

  return sessionsStorage.length().then(numberOfKeys => {

    if (numberOfKeys != 0) {
      console.log('Getting sessions from cache');

      let sessions = [];

      return sessionsStorage
        .iterate((value, key, iterationNumber) => { sessions.push(value) })
        .then(() => sessions)

    } else {
      console.log('Getting sessions from internet');

      return fetch(DATA_START_URL + 'sessions.json')
        .then(resp => resp.json())
        .then(sessions => {
          for (let key in sessions) {
            sessionsStorage.setItem(key, sessions[key]);
          }
          return sessions;
        })

    }
  })

}

function getSession(sessionID) {

  return sessionsStorage.keys().then(keys => {

    if (keys.includes(sessionID)) {
      return sessionsStorage.getItem(sessionID)
    }
    else {
      console.error('No sessions existing with this id');
    }

  })
}

function getSessionSpeakers(sessionID) {

  return getSession(sessionID)
    .then(session => {

      if (session.speakers) {

        return getAllSpeakers()
          .then(speakers => speakers.filter(speaker => session.speakers.includes(speaker.id)))

      } else {
        return [];
      }

    })
    .catch(error => console.error('Error while fetching speakers for session ' + session.title, error))

}


function getAllSpeakers() {

  return speakersStorage.length().then(numberOfKeys => {

    if (numberOfKeys != 0) {
      console.log('Getting speakers from cache');

      let speakers = [];

      return speakersStorage
        .iterate((value, key, iterationNumber) => { speakers.push(value) })
        .then(() => speakers)

    } else {
      console.log('Getting speakers from internet');

      return fetch(DATA_START_URL + 'speakers.json')
        .then(resp => resp.json())
        .then(speakers => {
          for (let key in speakers) {
            speakersStorage.setItem(key, speakers[key]);
          }
          return speakers;
        })

    }
  })

}

function getSpeaker(speakerID) {

  return speakersStorage.keys().then(keys => {
    if (keys.includes(speakerID)) {
      return speakersStorage.getItem(speakerID)
    }
    else {
      console.error('No speaker existing with the ID ' + speakerID);
    }

  })
}

function getSpeakerSessions(speakerID) {

  return getSpeaker(speakerID)
    .then(speaker => {

      return getAllSessions()
        .then(sessions => sessions
          .filter(session => "speakers" in session)
          .filter(session => session.speakers.includes(speaker.id))
        )

    })
    .catch(error => console.error('Error while fetching sessions for speaker ' + speaker.name, error))

}

function getNote(sessionID) {
  return notesStorage.getItem(sessionID)
    .then(note => note != null ? note : undefined)
}

function saveNote(sessionID, note) {
  getNote(sessionID).then(savedNote => notesStorage.setItem(sessionID, note))
}

function deleteImageFromNote(sessionID, img, defaultImg) {

  getNote(sessionID).then(savedNote => {
    if (savedNote) {
      savedNote.pictures = savedNote.pictures.map(pic => {
        if (pic == img)
          pic = defaultImg;
        return pic;
      });
      notesStorage.setItem(sessionID, savedNote);
    }
  })
}

function findSessionDate(sessionID) {

  let sessionDate = {};

  return scheduleStorage.iterate((day, key, iterationNumber) => {

    day.timeslots.map(timeslot => {
      timeslot.sessions.map(sessions => {
        if (sessions.includes(parseInt(sessionID))) {
          sessionDate.day = day.date;
          sessionDate.readableDay = day.dateReadable;
          sessionDate.startTime = timeslot.startTime;
          sessionDate.endTime = timeslot.endTime;
        }
      })
    })

    if (Object.keys(sessionDate).length !== 0)
      return sessionDate;

  })
    .then(sessionDate => sessionDate);

}


function getFavoriteSession(sessionID) {
  return calendarStorage.getItem(sessionID)
    .then(session => session != null ? session : undefined)
}

function addFavoriteSession(session, sessionSpeakers) {

  findSessionDate(session.id).then(date => {

    let speakers = [];
    sessionSpeakers.map(speaker => speakers.push(speaker.name));

    calendarStorage.setItem(session.id.toString(), {
      sessionID: session.id.toString(),
      title: session.title,
      speakers: speakers,
      date: date
    })

  })

}

function removeFavoriteSession(sessionID) {
  getFavoriteSession(sessionID)
    .then(favoriteSession => {
      if (favoriteSession) {
        calendarStorage.removeItem(sessionID)
          .then(() => console.log('Favorite session successfully removed'))
          .catch(error => console.error('Could not remove session'))
      }
    })

}

function getAllFavoriteSessions() {

  let sessions = [];

  return calendarStorage
    .iterate((value, key, iterationNumber) => { sessions.push(value) })
    .then(() => sessions)
}