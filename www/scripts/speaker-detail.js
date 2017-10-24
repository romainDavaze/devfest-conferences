'use strict';

const DEVFEST_URL = 'https://devfest.gdgnantes.com';

const speakerID = window.location.search.substring(1).split('=').pop();

(() => {

  $(document).ready(function(){
    $('.button-collapse').sideNav();
  });
  
  document.getElementById('nav-home').setAttribute('href', '../home.html');
  document.getElementById('nav-calendar').setAttribute('href', '../views/calendar.html');
  document.getElementById('nav-sessions').setAttribute('href', '../views/sessions.html');
  document.getElementById('nav-speakers').setAttribute('href', '../views/speakers.html');
  document.getElementById('nav-about-phone').setAttribute('href', '../views/about-device.html');

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {

    let contactSwitch = document.getElementById('add-contact');
    contactSwitch.onchange = (() => handleContact(contactSwitch.checked));
    let currentSpeaker;

    let fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];

    let options = new ContactFindOptions();
    options.multiple = false;


    getSpeaker(speakerID)
      .then(speaker => {

        currentSpeaker = speaker;

        options.filter = speaker.name;

        checkContact();

        handleSpeaker(speaker);
      })
      .catch(error => console.error('Error while retrieving speaker with ID ' + speakerID, error))


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

        let speakerCompany = new ContactOrganization();
        speakerCompany.name = currentSpeaker.company;

        let speakerLinks = [];

        if ("socials" in currentSpeaker) {
          currentSpeaker.socials.forEach(social =>
            speakerLinks.push(new ContactField(social.name, social.link, false))
          )
        }

        getSpeakerSessions(speakerID)
          .then(sessions => {
            let conferences = 'Conference(s) \n';
            sessions.map(session => conferences += session.title + '\n');

            let contact = navigator.contacts.create({
              "displayName": currentSpeaker.name,
              "name": currentSpeaker.name,
              "organizations": [speakerCompany],
              "urls": speakerLinks,
              "note": conferences
              // "photo" : [document.getElementById('speaker-pic').src]
            })

            contact.save();

            Materialize.toast(currentSpeaker.name + ' added to contacts', 3000);

          })
          .catch(error => console.error('Could not find sessions for speaker ' + currentSpeaker.name))

      } else {

        navigator.contacts.find(fields, removeContact, contactNotFound, options);

      }


    }

  }

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
                sessionChild.innerHTML = '* ' + session.title + '<br/>';
                sessionChild.setAttribute('href', '../views/session-detail.html?sessionID=' + session.id);
    
                sessionParent.appendChild(sessionChild);
    
              });
    
            })
            .catch(function (error) {
              console.error('Error while fetching sessions for speaker ' + speaker.name, error);
            });
    
    
        }

  function removeContact(contact) {
    contact[0].remove();
    Materialize.toast(contact[0].displayName + ' removed from contacts', 3000);
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



})();