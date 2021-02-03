let baseURL = 'http://127.0.0.1:8888';
let classID = -1;

let classroom, students;
let page_toggle_btn, quiz_card_wrapper;
let stu_table = '<h1>Loading...</h1>';

function quiz_card_template(cl, i) {
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
		id1 = `<span class="material-icons delete_btn" onclick="toggle_modal_3(${cl.ID} ,${i})">delete</span>`;
		id2 = 'Results';
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
		id5 = `onclick="toResults(${cl.ID})"`;
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
		} else if (cl.SCORE !== undefined) {
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
				id5 = `onclick="(() => window.location = 'quiz.html?classID=${classID}&quizID=${cl.ID}')()"`;
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

const fillStudentTable = () => {
	if (students.length === 0) stu_table = '<h1>NO STUDENTS IN THIS CLASS</h1>';
	else {
		stu_table =
			'<h1>STUDENTS</h1><table><tr><th>FIRST NAME</th><th>LAST NAME</th><th>EMAIL</th><th></th></tr>';
		students.forEach((student, i) => {
			stu_table += `<tr>
				<td>${student.FIRST_NAME}</td>
				<td>${student.LAST_NAME}</td>
				<td>${student.EMAIL}</td>
				<td><button onclick="toggle_modal_2(${i})">
						<span class="material-icons">remove_circle</span>
						REMOVE STUDENT
				</button></td>
			</tr>`;
		});
		stu_table += '</table>';
	}
};

window.onload = () => {
	const getData = () => {
		let requestOptions = {
			method: 'GET',
			mode: 'cors',
			credentials: 'include'
		};

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

						fetch(
							`${baseURL}/student/allstudents/${classID}`,
							requestOptions
						)
							.then(result => result.json())
							.then(res => {
								if (res.STATUS === 1) {
									students = res.DATA;
									fillStudentTable();
								} else {
									alert(res.MESSAGE);
									window.location = 'dashboard.html';
								}
							})
							.catch(error => console.log('error', error));
					}

					quiz_card_wrapper = document.querySelector(
						'.quiz_card_wrapper'
					);
					if (classroom.QUIZZES.length === 0) {
						quiz_card_wrapper.innerHTML = `<h1>NO QUIZZES IN THIS CLASS</h1>`;
					} else {
						quiz_card_wrapper.innerHTML = `
				${classroom.QUIZZES.map(quiz_card_template).join('')}`;
					}
				} else {
					// alert(res.MESSAGE);
					window.location = 'dashboard.html';
				}
			})
			.catch(error => console.log('error', error));
	};

	let requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include'
	};

	fetch(`${baseURL}/user/check`, requestOptions)
		.then(result => result.json())
		.then(res => {
			// console.log(res);
			if (res.STATUS === 1) {
				document.getElementById(
					'name'
				).innerHTML = sessionStorage.getItem('name');
				getData();
			} else window.location = 'signIn.html';
		})
		.catch(error => console.log('error', error));

	classID = window.location.search
		.substring(1)
		.split('&')
		.map(ele => ele.split('='))[0][1];

	// console.log(classID);

	page_toggle_btn = document.getElementById('page_toggle_btn');
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

	let requestOptions = {
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
		let requestOptions = {
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

let page = 1;
const toggle_contents = () => {
	if (page === 1) {
		quiz_card_wrapper.innerHTML = stu_table;
		page_toggle_btn.innerHTML =
			'<span class="material-icons">assignment</span> Quizzes';
		page = 2;
	} else {
		if (classroom.QUIZZES.length === 0) {
			quiz_card_wrapper.innerHTML = `<h1>NO QUIZZES IN THIS CLASS</h1>`;
		} else {
			quiz_card_wrapper.innerHTML = `${classroom.QUIZZES.map(
				quiz_card_template
			).join('')}`;
		}
		page_toggle_btn.innerHTML =
			'<span class="material-icons">people</span> Students';
		page = 1;
	}
};

let modal3_visible = false;
let quiz_id, quiz_idx;
const toggle_modal_3 = (q_id, idx) => {
	let modal = document.querySelector('.modal-bg');
	if (modal3_visible) {
		modal.classList.remove('show-modal3');
		modal3_visible = false;
	} else {
		let remove_quiz_para = document.getElementById('remove_quiz_para');
		remove_quiz_para.innerHTML = `Are you sure you want to remove <span>${classroom.QUIZZES[idx]['TITLE']}</span> from <span>${classroom.TITLE}</span>`;
		quiz_id = q_id;
		quiz_idx = idx;
		modal.classList.add('show-modal3');
		modal3_visible = true;
	}
};

const deleteQuiz = () => {
	document.getElementById('remove_quiz_btn').disabled = true;
	// console.log(students[stu_idx]);
	let requestOptions = {
		method: 'DELETE',
		mode: 'cors',
		credentials: 'include'
	};
	fetch(
		`${baseURL}/quiz/remove?classID=${classID}&quizID=${quiz_id}`,
		requestOptions
	)
		.then(result => result.json())
		.then(res => {
			alert(res.MESSAGE);
			document.getElementById('remove_quiz_btn').disabled = false;
			if (res.STATUS === 1) {
				// window.location = 'dashboard.html';
				classroom.QUIZZES.splice(quiz_idx, 1);
				fillStudentTable();
				if (classroom.QUIZZES.length === 0) {
					quiz_card_wrapper.innerHTML = `<h1>NO QUIZZES IN THIS CLASS</h1>`;
				} else {
					quiz_card_wrapper.innerHTML = `
				${classroom.QUIZZES.map(quiz_card_template).join('')}`;
				}
				toggle_modal_3();
			}
		})
		.catch(error => console.log('error', error));
};

let modal2_visible = false;
let stu_idx;
const toggle_modal_2 = i => {
	let modal = document.querySelector('.modal-bg');
	if (modal2_visible) {
		modal.classList.remove('show-modal2');
		modal2_visible = false;
	} else {
		let remove_stu_para = document.getElementById('remove_stu_para');
		remove_stu_para.innerHTML = `Are you sure you want to remove <span>${students[i].FIRST_NAME} ${students[i].LAST_NAME}</span> from <span>${classroom.TITLE}</span>`;
		stu_idx = i;
		modal.classList.add('show-modal2');
		modal2_visible = true;
	}
};

const deleteStudent = () => {
	document.getElementById('remove_btn').disabled = true;
	// console.log(students[stu_idx]);
	let requestOptions = {
		method: 'DELETE',
		mode: 'cors',
		credentials: 'include'
	};
	fetch(
		`${baseURL}/student/remove?classID=${classID}&studentID=${students[stu_idx].ID}`,
		requestOptions
	)
		.then(result => result.json())
		.then(res => {
			alert(res.MESSAGE);
			document.getElementById('remove_btn').disabled = false;
			if (res.STATUS === 1) {
				// window.location = 'dashboard.html';
				students.splice(stu_idx, 1);
				fillStudentTable();
				quiz_card_wrapper.innerHTML = stu_table;
				toggle_modal_2();
			}
		})
		.catch(error => console.log('error', error));
};

const toAddQuiz = () => {
	window.location = `addquiz.html?classID=${classID}`;
};

const toResults = id => {
	window.location = `results.html?quizID=${id}`;
};
