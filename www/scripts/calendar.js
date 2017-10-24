(() => {

	getAllFavoriteSessions()
		.then(sessions => {
			console.log(sessions);
			sortSessions(sessions);

			sessions.map(session => addEvent(session));

		})



	function sortSessions(sessions){
		sessions.sort(function(a,b) {
			let fd = new Date(a.date.day + 'T' + a.date.startTime +':00');
			let sd = new Date(b.date.day + 'T' + b.date.startTime +':00');

			return fd - sd;
		});
	}


	function addEvent(session){

	  let parent = document.getElementById('calendar');

	  let col = document.createElement('div');
	  col.className = 'col s12 m6';
	  col.onclick = (() => redirectTo('../views/session-detail.html?sessionID=' + session.sessionID));

	  let card = document.createElement('div');
	  card.className = 'card blue-grey darken-1';

	  let content = document.createElement('div');
	  content.className = 'card-content white-text';

	  let span = document.createElement('span');
	  span.className = 'card-title';
	  span.innerHTML = session.title;

	  let p = document.createElement('p');
	  
	  if(session.speakers.length != 0) {
		  p.innerHTML = 'By ';
	  }
		  
	  session.speakers.map(speaker => p.innerHTML += ' ' + speaker + ',')
	  p.innerHTML = p.innerHTML.slice(0, -1);

	  let date = document.createElement('div');
	  date.className = 'card-action';
	  date.innerHTML = session.date.readableDay + ' - from ' + session.date.startTime + ' to ' + session.date.endTime;

	  content.appendChild(span);
	  content.appendChild(p);

	  card.appendChild(content);
	  card.appendChild(date);

	  col.appendChild(card);

	  parent.appendChild(col);

	}

})();