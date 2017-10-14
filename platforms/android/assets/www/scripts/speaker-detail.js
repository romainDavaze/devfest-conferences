'use strict';

const DEVFEST_URL = 'https://devfest.gdgnantes.com';

(() => {

  document.addEventListener("deviceready", onDeviceReady, false);


  function onDeviceReady() {

    let contactSwitch = document.getElementById('add-contact');
    contactSwitch.onchange = (() => handleContact(contactSwitch.checked));

    let speakerID = window.location.search.substring(1).split('=').pop();
    let speakerName;

    let fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];

    let options = new ContactFindOptions();
    options.multiple = false;


    getSpeaker(speakerID)
      .then(speaker => {

        speakerName = speaker.name;

        options.filter = speaker.name;

        checkContact();

        handleSpeaker(speaker);
      })
      .catch(error => console.error('Error while retrieving speaker with ID ' + speakerID, error))


    function handleSpeaker(speaker) {

      document.getElementById('speaker-name').innerHTML = speaker.name;

      if (speaker.photoUrl) {
        document.getElementById('speaker-pic').src = DEVFEST_URL + speaker.photoUrl;
      } else {
        document.getElementById('speaker-pic').src = '../assets/logo_devfest.jpg';
      }

      if (speaker.bio) {
        document.getElementById('speaker-bio').innerHTML = speaker.bio;
      }

      getSpeakerSessions(speakerID)
        .then(sessions => {

          let parent = document.getElementById('speaker');

          if (sessions.length != 0) {
            document.getElementById('sessions').innerHTML = 'Session(s) <br/>';
          }

          sessions.map(session => {

            let sessionParent = document.getElementById('sessions');

            let sessionChild = document.createElement('a');
            sessionChild.innerHTML = session.title + '<br/>';
            sessionChild.setAttribute('href', '../views/session-detail.html?sessionID=' + session.id);

            sessionParent.appendChild(sessionChild);

          });

        })
        .catch(function (error) {
          console.error('Error while fetching sessions for speaker ' + speaker.name, error);
        });


    }


    function checkContact() {
      navigator.contacts.find(fields,
        (contact => {
          if (contact.length != 0) {
            contactSwitch.checked = true;
          }
        }),
        (error => contactSwitch.checked = false),
        options);
    }


    function handleContact(checked) {

      if (checked) {

        let contact = navigator.contacts.create({
          "displayName": speakerName,
          "name": speakerName,
          // "photo" : [document.getElementById('speaker-pic').src]
        })

        contact.save();

      } else {

        navigator.contacts.find(fields, removeContact, contactNotFound, options);

      }


    }

    function removeContact(contact) {
      contact[0].remove();
    }

    function contactNotFound(error) {
      console.error('Contact not found ', error);
    }

    function contactRemoved() {
      console.log('Contact successfully removed');
    }

    function contactNotRemoved(error) {
      console.error('Contact removing failed ', error);
    }

  }


})();