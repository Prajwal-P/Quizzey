let baseURL = 'http://127.0.0.1:8888';

let quizzes = '<h1>Loading...</h1>';
let no_of_questions = -1,
	current_question = -1,
	duration = -1,
	answers = {};

const checkUser = () => {
	let requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include'
	};

	fetch(`${baseURL}/user/check`, requestOptions)
		.then(result => result.json())
		.then(res => {
			// console.log(res);
			if (res.STATUS === 1) getQuiz();
			else window.location = 'signIn.html';
			document.getElementById('name').innerHTML = sessionStorage.getItem(
				'name'
			);
		})
		.catch(error => {
			console.log('error', error);
			window.location = 'signIn.html';
		});
};

const getQuiz = () => {
	if (classID && quizID) {
		let requestOptions = {
			method: 'GET',
			mode: 'cors',
			credentials: 'include'
		};
		fetch(
			`${baseURL}/quiz?classID=${classID}&quizID=${quizID}`,
			requestOptions
		)
			.then(result => result.json())
			.then(res => {
				if (res.STATUS === 1) {
					quizzes = res.DATA;
					no_of_questions = quizzes['NO_OF_QUESTIONS'];
					current_question = 0;
					duration = quizzes['DURATION'];
					renderTimer();
					renderQuestion(current_question);
				} else {
					alert(res.MESSAGE);
					window.location = 'dashboard.html';
				}
			})
			.catch(error => {
				console.log('error', error);
				// window.location = 'signIn.html';
			});
	} else window.location = 'signIn.html';
};

let classID = window.location.search
	.substring(1)
	.split('&')
	.map(ele => ele.split('='))[0][1];
let quizID = window.location.search
	.substring(1)
	.split('&')
	.map(ele => ele.split('='))[1][1];

checkUser();

let menu_visible = false;
function toggle_dropdown() {
	let dd = document.querySelector('.dd_wrapper');
	if (menu_visible) {
		dd.classList.remove('show');
		menu_visible = false;
	} else {
		dd.classList.add('show');
		menu_visible = true;
	}
}

const renderTimer = () => {
	let time = duration * 60;
	const countDown = document.getElementById('countdown');
	let hours = parseInt(time / 3600);
	let minutes = parseInt(time / 60) % 60;
	let seconds = time % 60;
	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	countDown.innerHTML = `${hours} : ${minutes} : ${seconds}`;
	const updateCountdown = () => {
		time--;
		hours = parseInt(time / 3600);
		minutes = parseInt(time / 60) % 60;
		seconds = time % 60;
		hours = hours < 10 ? '0' + hours : hours;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		countDown.innerHTML = `${hours} : ${minutes} : ${seconds}`;
		if (time <= 0) {
			clearInterval(timer);
			submitQuiz();
		}
	};
	let timer = setInterval(updateCountdown, 1000);
};

const renderQuestion = qusetionIdx => {
	let questionTemplate = `
		<h2>QUESTION ${qusetionIdx + 1}</h2>
		<p>
			${quizzes['QUESTIONS'][qusetionIdx]['QUESTION']}
		</p>
		<div class="option">
			<input id="${quizzes['QUESTIONS'][qusetionIdx]['OPTIONS'][0]['OPTION_ID']}" 
			type="radio" name="${quizzes['QUESTIONS'][qusetionIdx]['QUESTION_ID']}"
			onchange="getAnswer(this)" />
			<label for="${quizzes['QUESTIONS'][qusetionIdx]['OPTIONS'][0]['OPTION_ID']}">
				${quizzes['QUESTIONS'][qusetionIdx]['OPTIONS'][0]['CHOICE']}
			</label>
		</div>
		<div class="option">
			<input id="${quizzes['QUESTIONS'][qusetionIdx]['OPTIONS'][1]['OPTION_ID']}"
			type="radio" name="${quizzes['QUESTIONS'][qusetionIdx]['QUESTION_ID']}"
			onchange="getAnswer(this)" />
			<label for="${quizzes['QUESTIONS'][qusetionIdx]['OPTIONS'][1]['OPTION_ID']}">
				${quizzes['QUESTIONS'][qusetionIdx]['OPTIONS'][1]['CHOICE']}
			</label>
		</div>
		<div class="option">
			<input id="${quizzes['QUESTIONS'][qusetionIdx]['OPTIONS'][2]['OPTION_ID']}"
			type="radio" name="${quizzes['QUESTIONS'][qusetionIdx]['QUESTION_ID']}"
			onchange="getAnswer(this)" />
			<label for="${quizzes['QUESTIONS'][qusetionIdx]['OPTIONS'][2]['OPTION_ID']}">
				${quizzes['QUESTIONS'][qusetionIdx]['OPTIONS'][2]['CHOICE']}
			</label>
		</div>
		<div class="option">
			<input id="${quizzes['QUESTIONS'][qusetionIdx]['OPTIONS'][3]['OPTION_ID']}"
			type="radio" name="${quizzes['QUESTIONS'][qusetionIdx]['QUESTION_ID']}"
			onchange="getAnswer(this)" />
			<label for="${quizzes['QUESTIONS'][qusetionIdx]['OPTIONS'][3]['OPTION_ID']}">
				${quizzes['QUESTIONS'][qusetionIdx]['OPTIONS'][3]['CHOICE']}
			</label>
		</div>
	`;

	document.getElementById('question').innerHTML = questionTemplate;
};

const getAnswer = btn => {
	answers[btn.name] = btn.id;
};

const nextQuestion = () => {
	document.getElementById('prev-btn').disabled = false;
	if (current_question + 1 < no_of_questions) {
		current_question++;
		renderQuestion(current_question);
		if (current_question === no_of_questions - 1)
			document.getElementById('next-btn').disabled = true;
	} else {
		document.getElementById('next-btn').disabled = true;
	}
};

const prevQuestion = () => {
	document.getElementById('next-btn').disabled = false;
	if (current_question - 1 >= 0) {
		current_question--;
		renderQuestion(current_question);
		if (current_question === 0)
			document.getElementById('prev-btn').disabled = true;
	} else {
		document.getElementById('prev-btn').disabled = true;
	}
};

const submitQuiz = () => {
	let data = {
		classID: classID,
		quizID: quizID,
		solutions: answers
	};

	let requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(data),
		mode: 'cors',
		credentials: 'include'
	};
	fetch(`${baseURL}/quiz/submit`, requestOptions)
		.then(result => result.json())
		.then(res => {
			alert(res.MESSAGE);
			if (res.STATUS === 1) {
				window.location = `classroom.html?classID=${classID}`;
			}
		})
		.catch(error => console.log('error', error));
};
