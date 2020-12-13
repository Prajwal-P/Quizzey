let baseURL = 'http://127.0.0.1:8888';

let all_classrooms = [
	{
		id: 1,
		name: 'Web Technology',
		description:
			'Subject Code : 17CS71, Teacher : Sushma H R, Classroom for taking quiz related to HTML, CSS and JS'
	},
	{
		id: 2,
		name: 'Advanced Computer Architecture',
		description:
			'Subject Code : 17CS72, Teacher : Hemavathi, Classroom for taking quiz related to ACA'
	},
	{
		id: 3,
		name: 'ML',
		description: 'Subject Code : 17CS73, Teacher : Asha T'
	},
	{
		id: 4,
		name: 'UNIX',
		description:
			'Teacher : Divyashree, Classroom for taking quiz related to unix'
	},
	{
		id: 5,
		name: 'SAN',
		description: 'Teacher : Nikhitha'
	},
	{
		id: 6,
		name: 'Web Technology lab and Mini-project',
		description: ''
	},
	{
		id: 7,
		name: 'ML LAb',
		description:
			'Teacher : Madhuri, Classroom for taking quiz related to ML lab'
	}
];

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
};

function cls_template(cls) {
	return `
		<div class="class_card">
			<h2>${cls.name}</h2>
			<hr />
			<span>
				${cls.description}
			</span>
		</div>
	`;
}

document.querySelector('.class_card_wrapper').innerHTML = `
	${all_classrooms.map(cls_template).join('')}
`;

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

let modal_visible = false;
function toggle_modal() {
	let modal = document.querySelector('.modal-bg');
	if (modal_visible) {
		modal.classList.remove('show-modal');
		modal_visible = false;
	} else {
		modal.classList.add('show-modal');
		modal_visible = true;
	}
}

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
			alert(res.MESSAGE);
			if (res.STATUS === 1) {
				window.location = 'signIn.html';
			}
		})
		.catch(error => console.log('error', error));
};
