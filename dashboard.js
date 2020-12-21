let baseURL = 'http://127.0.0.1:8888';

let all_classrooms = '';

window.onload = () => {
	let requestOptions = {
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

	function cls_template(cls) {
		return `
		<div class="class_card" id=${cls.ID} onclick="openClassroom(${cls.ID})">
			<h2>${cls.TITLE}</h2>
			<hr />
			<span>
				${cls.DESCRIPTION}
			</span>
		</div>
	`;
	}

	fetch(`${baseURL}/classroom`, requestOptions)
		.then(result => result.json())
		.then(res => {
			if (res.STATUS === 1) {
				// console.log(res.DATA);
				all_classrooms = res.DATA;
				document.querySelector('.class_card_wrapper').innerHTML = `
					${all_classrooms.map(cls_template).join('')}
				`;
			}
		})
		.catch(error => console.log('error', error));

	document.querySelector('.class_card_wrapper').innerHTML =
		'<h1>Loading...<h1>';
};

let menu_visible = false;
function toggle_dropdown() {
	// let dd = document.getElementById("dropdown");
	let dd = document.querySelector('.dd_wrapper');
	if (menu_visible) {
		dd.classList.remove('show');
		menu_visible = false;
	} else {
		dd.classList.add('show');
		menu_visible = true;
	}
}

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

let createClassForm = document.getElementById('createClassForm');
createClassForm.addEventListener('submit', e => {
	e.preventDefault();

	let data = new FormData();
	for (let i = 0; i < 2; i++) {
		data.append(createClassForm[i].name, createClassForm[i].value);
	}

	var requestOptions = {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		body: data
	};

	fetch(`${baseURL}/classroom/add`, requestOptions)
		.then(result => result.json())
		.then(res => {
			alert(res.MESSAGE);
			if (res.STATUS === 1) {
				// location.reload();
				// Redirect to classroom.html/id
				window.location = `classroom.html?classID=${res.DATA['classID']}`;
			}
		})
		.catch(error => console.log('error', error));
});

let modal2_visible = false;
function toggle_modal_2() {
	let modal = document.querySelector('.modal-bg');
	if (modal2_visible) {
		modal.classList.remove('show-modal2');
		modal2_visible = false;
	} else {
		modal.classList.add('show-modal2');
		modal2_visible = true;
	}
}

let joinClassForm = document.getElementById('joinClassForm');
joinClassForm.addEventListener('submit', e => {
	e.preventDefault();

	let data = new FormData();
	data.append(joinClassForm[0].name, joinClassForm[0].value);

	var requestOptions = {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		body: data
	};

	fetch(`${baseURL}/classroom/join`, requestOptions)
		.then(result => result.json())
		.then(res => {
			alert(res.MESSAGE);
			if (res.DATA) {
				// location.reload();
				// Redirect to classroom.html/id
				window.location = `classroom.html?classID=${res.DATA['classID']}`;
			}
		})
		.catch(error => console.log('error', error));
});

let openClassroom = id => {
	window.location = `classroom.html?classID=${id}`;
};

let signOut = () => {
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
