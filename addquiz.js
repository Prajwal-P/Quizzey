let baseURL = 'http://127.0.0.1:8888';

let classID;
let no_of_questions = 1;

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

	let addQuizForm = document.getElementById('addQuizForm');

	addQuizForm.addEventListener('submit', e => {
		e.preventDefault();
		let data = {};
		data['class_id'] = classID;
		for (let i = 0; i < 6; i++) {
			data[addQuizForm[i].name] = addQuizForm[i].value;
		}
		data['no_of_questions'] = no_of_questions;
		data['questions'] = [];
		for (let i = 6; i < addQuizForm.length - 1; i += 10) {
			// console.log(addQuizForm[i].checked);
			let question = {};
			question['question'] = addQuizForm[i].value;
			question['marks'] = addQuizForm[i + 1].value;
			let options = [];
			for (let j = i + 2; j < i + 10; j += 2) {
				let opt = {};
				opt['is_correct'] = addQuizForm[j].checked ? 1 : 0;
				opt['option'] = addQuizForm[j + 1].value;
				options.push(opt);
			}
			question['options'] = options;
			data['questions'].push(question);
		}
		console.log(data);

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
		fetch(`${baseURL}/quiz/add`, requestOptions)
			.then(result => result.json())
			.then(res => {
				alert(res.MESSAGE);
				if (res.STATUS === 1)
					window.location = `classroom.html?classID=${classID}`;
			});
	});

	classID = window.location.search
		.substring(1)
		.split('&')
		.map(ele => ele.split('='))[0][1];
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

function addQuestion() {
	let node = document.createElement('div');
	node.className = 'question_options';
	node.innerHTML = `<label for="quetion">Question : </label>
	<span id="delete_btn" class="material-icons" onclick="deleteQuestion(this)">delete</span>
	<input class="question" type="text" name="question" required>
	<label for="mark">Mark(s) : </label>
	<input class="question" type="number" style="width: 100px;" name="mark" required>
	<br>
	<label for="options">Options : </label><br>
	<input class="checks" type="radio" name="option_${
		no_of_questions + 1
	}" required>
	<input class="txt_field" style="margin: 4px 16px 0 0;" type="text" name="option_1" required>
	<input class="checks" type="radio" name="option_${no_of_questions + 1}">
	<input class="txt_field" type="text" name="option_2" required>
	<input class="checks" type="radio" name="option_${no_of_questions + 1}">
	<input class="txt_field" style="margin-right: 16px;" type="text" name="option_3" required>
	<input class="checks" type="radio" name="option_${no_of_questions + 1}">
	<input class="txt_field" type="text" name="option_4" required>`;

	document.getElementById('addQuizForm').appendChild(node);
	no_of_questions++;
}

function deleteQuestion(e) {
	if (no_of_questions == 1) {
		alert('MINIMUM NUMBER OF QUESTION SHOULD BE THERE TO CREATE A QUIZ');
	} else {
		e.parentNode.parentNode.removeChild(e.parentNode);
		no_of_questions--;
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
