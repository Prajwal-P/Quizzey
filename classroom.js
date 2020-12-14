let baseURL = 'http://127.0.0.1:8888';

let classroom = {
	id: 1,
	title: 'Web Technology',
	class_teacher: 'Sushma H R',
	description:
		'Subject Code : 17CS71, Teacher : Sushma H R, Classroom for taking quiz related to HTML, CSS and JS',
	class_code: 'ABC1234',
	quizzes: [
		{
			id: 1,
			title: 'Quiz-1',
			description: 'HTML Quiz',
			no_of_questions: 10,
			duration: 20,
			max_marks: 20,
			start_time: new Date('2019', '10', '12', '13', '45', '10'),
			end_time: new Date('2019', '10', '13', '10', '45', '10'),
			score: 18
		},
		{
			id: 4,
			title: 'Quiz-4',
			description: 'PHP, DBMS Quiz',
			no_of_questions: 30,
			duration: 30,
			max_marks: 30,
			start_time: new Date('2015', '9', '9', '10', '45', '10'),
			end_time: new Date('2015', '10', '12', '10', '45', '10')
		},
		{
			id: 2,
			title: 'Quiz-2',
			description: 'CSS Quiz',
			no_of_questions: 10,
			duration: 10,
			max_marks: 10,
			start_time: new Date('2021', '10', '12', '10', '45', '10'),
			end_time: new Date('2021', '11', '12', '10', '45', '10')
		},
		{
			id: 3,
			title: 'Quiz-3',
			description: 'HTML, CSS, JS Quiz',
			no_of_questions: 100,
			duration: 120,
			max_marks: 100,
			start_time: new Date('2020', '9', '20', '10', '45', '10'),
			end_time: new Date('2020', '11', '30', '10', '55', '10')
			// score: 85
		},
		{
			id: 6,
			title: 'Quiz-6',
			description: 'HTML, CSS, JS Quiz',
			no_of_questions: 100,
			duration: 120,
			max_marks: 100,
			start_time: new Date('2020', '9', '20', '10', '45', '10'),
			end_time: new Date('2020', '11', '30', '10', '55', '10'),
			score: 85
		}
	]
};

window.onload = () => {
	var requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include'
	};

	fetch(`${baseURL}/user/check`, requestOptions)
		.then(result => result.json())
		.then(res => {
			// console.log(res);
			if (res.STATUS === 1);
			else window.location = 'signIn.html';
			document.getElementById('name').innerHTML = sessionStorage.getItem(
				'name'
			);
		})
		.catch(error => console.log('error', error));

	document.querySelector('.class_card').innerHTML = `
	<div class="class_room">
		<div class="cls_title_and_teacher_name">
			<h2>${classroom.title}</h2>
			<p>${classroom.class_teacher}</p>
		</div>
		<p>${classroom.description}</p>
	</div>
	`;

	let add_quiz_card = document.querySelector('.add_quiz');
	if (!classroom.class_code) {
		add_quiz_card.style.display = 'None';
	} else {
		document.getElementById('classCode').innerHTML = classroom.class_code;
	}

	function quiz_card_template(cl) {
		let id1, id2, id3, id4, id5;
		let cur_time = new Date();
		let month = [
			'JAN',
			'FEB',
			'MAR',
			'APR',
			'MAY',
			'JUN',
			'JUL',
			'AUG',
			'SEP',
			'OCT',
			'NOV',
			'DEC'
		];
		if (classroom.class_code) {
			id1 = `<span class="material-icons delete_btn">delete</span>`;
			id2 = 'Open Quiz';
			id3 =
				'Start Time: ' +
				cl.start_time.getDate() +
				' ' +
				month[cl.start_time.getMonth()] +
				' ' +
				cl.start_time.getFullYear() +
				' ' +
				cl.start_time
					.toLocaleTimeString()
					.replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
			id4 =
				'End Time: ' +
				cl.end_time.getDate() +
				' ' +
				month[cl.end_time.getMonth()] +
				' ' +
				cl.end_time.getFullYear() +
				' ' +
				cl.end_time
					.toLocaleTimeString()
					.replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
		} else {
			id1 = `MAX MARKS : ${cl.max_marks}`;
			id2 = 'Take Quiz';
			if (cur_time < cl.start_time) {
				// Test still not started
				id3 =
					'Start Time: ' +
					cl.start_time.getDate() +
					' ' +
					month[cl.start_time.getMonth()] +
					' ' +
					cl.start_time.getFullYear() +
					' ' +
					cl.start_time
						.toLocaleTimeString()
						.replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
				id4 =
					'End Time: ' +
					cl.end_time.getDate() +
					' ' +
					month[cl.end_time.getMonth()] +
					' ' +
					cl.end_time.getFullYear() +
					' ' +
					cl.end_time
						.toLocaleTimeString()
						.replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
				id5 = 'disabled';
			} else if (cl.score) {
				// Test already taken
				if (cur_time < cl.end_time) {
					// Do not show score, Disable test button
					id2 = 'Quiz Taken';
					id3 = 'Duration: ' + cl.duration + ' min';
					id4 = 'No. of Questions: ' + cl.no_of_questions;
					id5 = 'disabled';
				} else {
					// Show score
					id2 = 'Score: ' + cl.score;
					id3 =
						'Start Time: ' +
						cl.start_time.getDate() +
						' ' +
						month[cl.start_time.getMonth()] +
						' ' +
						cl.start_time.getFullYear() +
						' ' +
						cl.start_time
							.toLocaleTimeString()
							.replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
					id4 =
						'End Time: ' +
						cl.end_time.getDate() +
						' ' +
						month[cl.end_time.getMonth()] +
						' ' +
						cl.end_time.getFullYear() +
						' ' +
						cl.end_time
							.toLocaleTimeString()
							.replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
					id5 = "class='btn_sec'";
				}
			} else {
				// Test not taken
				if (cur_time < cl.end_time) {
					// Enable take test button
					id3 = 'Duration: ' + cl.duration + ' min';
					id4 = 'No. of Questions: ' + cl.no_of_questions;
				} else {
					// Test Expired and disable button
					id2 = 'Test Expired';
					id3 =
						'Start Time: ' +
						cl.start_time.getDate() +
						' ' +
						month[cl.start_time.getMonth()] +
						' ' +
						cl.start_time.getFullYear() +
						' ' +
						cl.start_time
							.toLocaleTimeString()
							.replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
					id4 =
						'End Time: ' +
						cl.end_time.getDate() +
						' ' +
						month[cl.end_time.getMonth()] +
						' ' +
						cl.end_time.getFullYear() +
						' ' +
						cl.end_time
							.toLocaleTimeString()
							.replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
					id5 = "class='btn_ter' disabled";
				}
			}
		}
		return `
		<div class="quiz_card">
			<div class="quiz_name_and_marks">
				<h2>${cl.title}</h2>
				<p>${id1}</p>
				</div>
			<P>${cl.description}</P>
			<div class="dur_and_no_of_que">
				<p>${id3}</p>
				<p>${id4}</p>
				<button ${id5}>${id2}</button>
			</div>
		</div>`;
	}

	document.querySelector('.quiz_card_wrapper').innerHTML = `
	${classroom.quizzes.map(quiz_card_template).join('')}
`;
};

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
