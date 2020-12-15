let baseURL = 'http://127.0.0.1:8888';
let classID = -1;

let classroom = {};

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
			if (res.STATUS === 1)
				document.getElementById(
					'name'
				).innerHTML = sessionStorage.getItem('name');
			else window.location = 'signIn.html';
		})
		.catch(error => console.log('error', error));

	classID = window.location.search
		.substring(1)
		.split('&')
		.map(ele => ele.split('='))[0][1];

	// console.log(classID);

	fetch(`${baseURL}/classroom/${classID}`, requestOptions)
		.then(result => result.json())
		.then(res => {
			if (res.STATUS === 1) {
				classroom = res.DATA;

				document.querySelector('.class_card').innerHTML = `
					<div class="class_room">
						<div class="cls_title_and_teacher_name">
							<h2>${classroom.TITLE}</h2>
							<p>${classroom.FULL_NAME}</p>
						</div>
						<p>${classroom.DESCRIPTION}</p>
					</div>
				`;

				let options_card = document.querySelector('.options_card');
				if (classroom.CLASS_CODE) {
					options_card.style.display = 'block';
					document.getElementById('classCode').innerHTML =
						classroom.CLASS_CODE;
				}

				function quiz_card_template(cl) {
					cl.START_TIME = new Date(cl.START_TIME);
					cl.END_TIME = new Date(cl.END_TIME);

					let timezone = cl.START_TIME.getTimezoneOffset();
					timezone *= 2;
					let hr = parseInt(timezone / -60);
					let min = timezone % -60;
					min *= -1;
					// console.log(hr, min);
					cl.START_TIME.setHours(cl.START_TIME.getHours() + hr);
					cl.START_TIME.setMinutes(cl.START_TIME.getMinutes() + min);
					cl.END_TIME.setHours(cl.END_TIME.getHours() + hr);
					cl.END_TIME.setMinutes(cl.END_TIME.getMinutes() + min);

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
					if (classroom.CLASS_CODE) {
						id1 = `<span class="material-icons delete_btn">delete</span>`;
						id2 = 'Open Quiz';
						id3 =
							'Start Time: ' +
							cl.START_TIME.getDate() +
							' ' +
							month[cl.START_TIME.getMonth()] +
							' ' +
							cl.START_TIME.getFullYear() +
							' ' +
							cl.START_TIME.toLocaleTimeString().replace(
								/([\d]+:[\d]{2})(:[\d]{2})(.*)/,
								'$1$3'
							);
						id4 =
							'End Time: ' +
							cl.END_TIME.getDate() +
							' ' +
							month[cl.END_TIME.getMonth()] +
							' ' +
							cl.END_TIME.getFullYear() +
							' ' +
							cl.END_TIME.toLocaleTimeString().replace(
								/([\d]+:[\d]{2})(:[\d]{2})(.*)/,
								'$1$3'
							);
					} else {
						id1 = `MAX MARKS : ${cl.MAX_MARKS}`;
						id2 = 'Take Quiz';
						if (cur_time < cl.START_TIME) {
							// Test still not started
							id3 =
								'Start Time: ' +
								cl.START_TIME.getDate() +
								' ' +
								month[cl.START_TIME.getMonth()] +
								' ' +
								cl.START_TIME.getFullYear() +
								' ' +
								cl.START_TIME.toLocaleTimeString().replace(
									/([\d]+:[\d]{2})(:[\d]{2})(.*)/,
									'$1$3'
								);
							id4 =
								'End Time: ' +
								cl.END_TIME.getDate() +
								' ' +
								month[cl.END_TIME.getMonth()] +
								' ' +
								cl.END_TIME.getFullYear() +
								' ' +
								cl.END_TIME.toLocaleTimeString().replace(
									/([\d]+:[\d]{2})(:[\d]{2})(.*)/,
									'$1$3'
								);
							id5 = 'disabled';
						} else if (cl.SCORE) {
							// Test already taken
							if (cur_time < cl.END_TIME) {
								// Do not show score, Disable test button
								id2 = 'Quiz Taken';
								id3 = 'Duration: ' + cl.DURATION + ' min';
								id4 = 'No. of Questions: ' + cl.NO_OF_QUESTIONS;
								id5 = 'disabled';
							} else {
								// Show score
								id2 = 'Score: ' + cl.SCORE;
								id3 =
									'Start Time: ' +
									cl.START_TIME.getDate() +
									' ' +
									month[cl.START_TIME.getMonth()] +
									' ' +
									cl.START_TIME.getFullYear() +
									' ' +
									cl.START_TIME.toLocaleTimeString().replace(
										/([\d]+:[\d]{2})(:[\d]{2})(.*)/,
										'$1$3'
									);
								id4 =
									'End Time: ' +
									cl.END_TIME.getDate() +
									' ' +
									month[cl.END_TIME.getMonth()] +
									' ' +
									cl.END_TIME.getFullYear() +
									' ' +
									cl.END_TIME.toLocaleTimeString().replace(
										/([\d]+:[\d]{2})(:[\d]{2})(.*)/,
										'$1$3'
									);
								id5 = "class='btn_sec'";
							}
						} else {
							// Test not taken
							if (cur_time < cl.END_TIME) {
								// Enable take test button
								id3 = 'Duration: ' + cl.DURATION + ' min';
								id4 = 'No. of Questions: ' + cl.NO_OF_QUESTIONS;
							} else {
								// Test Expired and disable button
								id2 = 'Test Expired';
								id3 =
									'Start Time: ' +
									cl.START_TIME.getDate() +
									' ' +
									month[cl.START_TIME.getMonth()] +
									' ' +
									cl.START_TIME.getFullYear() +
									' ' +
									cl.START_TIME.toLocaleTimeString().replace(
										/([\d]+:[\d]{2})(:[\d]{2})(.*)/,
										'$1$3'
									);
								id4 =
									'End Time: ' +
									cl.END_TIME.getDate() +
									' ' +
									month[cl.END_TIME.getMonth()] +
									' ' +
									cl.END_TIME.getFullYear() +
									' ' +
									cl.END_TIME.toLocaleTimeString().replace(
										/([\d]+:[\d]{2})(:[\d]{2})(.*)/,
										'$1$3'
									);
								id5 = "class='btn_ter' disabled";
							}
						}
					}
					return `
						<div class="quiz_card">
							<div class="quiz_name_and_marks">
								<h2>${cl.TITLE}</h2>
								<p>${id1}</p>
								</div>
							<P>${cl.DESCRIPTION}</P>
							<div class="dur_and_no_of_que">
								<p>${id3}</p>
								<p>${id4}</p>
								<button ${id5}>${id2}</button>
							</div>
						</div>`;
				}

				document.querySelector('.quiz_card_wrapper').innerHTML = `
				${classroom.QUIZZES.map(quiz_card_template).join('')}`;
			} else {
				alert(res.MESSAGE);
				window.location = 'dashboard.html';
			}
		});
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

const toDashboard = () => {
	window.location = './dashboard.html';
};

const signOut = () => {
	sessionStorage.clear();

	var requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include'
	};
	fetch(`${baseURL}/user/signOut`, requestOptions)
		.then(result => result.json())
		.then(res => {
			if (res.STATUS === 1) {
				window.location = 'signIn.html';
			} else {
				alert(res.MESSAGE);
			}
		})
		.catch(error => console.log('error', error));
};

let modal1_visible = false;
function toggle_modal_1() {
	let modal = document.querySelector('.modal-bg');
	if (modal1_visible) {
		modal.classList.remove('show-modal1');
		modal1_visible = false;
	} else {
		modal.classList.add('show-modal1');
		modal1_visible = true;
	}
}

const deleteClassForm = document.getElementById('deleteClassForm');
deleteClassForm.addEventListener('submit', e => {
	e.preventDefault();

	if (deleteClassForm[0].value === classroom.TITLE) {
		var requestOptions = {
			method: 'DELETE',
			mode: 'cors',
			credentials: 'include'
		};
		fetch(`${baseURL}/classroom/delete/${classID}`, requestOptions)
			.then(result => result.json())
			.then(res => {
				alert(res.MESSAGE);
				if (res.STATUS === 1) {
					window.location = 'dashboard.html';
				}
			})
			.catch(error => console.log('error', error));
	} else {
		document.getElementById('err_info').classList.add('show_err_info');
		setTimeout(
			() =>
				document
					.getElementById('err_info')
					.classList.remove('show_err_info'),
			5000
		);
	}
});
