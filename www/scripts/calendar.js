(() => {

	$(document).ready(() => {
		$('.button-collapse').sideNav();
	});

	document.getElementById('nav-home').setAttribute('href', '../home.html');
	document.getElementById('nav-calendar').onclick = (() => $('.button-collapse').sideNav('hide'));
	document.getElementById('nav-sessions').setAttribute('href', '../views/sessions.html');
	document.getElementById('nav-speakers').setAttribute('href', '../views/speakers.html');
	document.getElementById('nav-about-device').setAttribute('href', '../views/about-device.html');

	getAllFavoriteSessions()
		.then(sessions => {
			sortSessions(sessions);
			sessions.map(session => addEvent(session));
		})

	function sortSessions(sessions) {
		sessions.sort((a, b) => {
			let fd = new Date(a.date.day + 'T' + a.date.startTime + ':00');
			let sd = new Date(b.date.day + 'T' + b.date.startTime + ':00');

			return fd - sd;
		});
	}

	function addEvent(session) {

		let parent = document.getElementById('calendar');

		let col = document.createElement('div');
		col.className = 'col s12 m6';
		col.onclick = (() => redirectTo('../views/session-detail.html?sessionID=' + session.sessionID));

		let card = document.createElement('div');
		card.className = 'card lighten-1';

		let content = document.createElement('div');
		content.className = 'card-content black-text';

		let span = document.createElement('span');
		span.className = 'card-title';
		span.innerHTML = session.title;

		let p = document.createElement('p');
		p.className = 'author';

		if (session.speakers.length != 0) {
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