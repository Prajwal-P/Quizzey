let baseURL = 'http://127.0.0.1:8888';
let quizID,
	results = [];

const fillTable = () => {
	let results_tbl = document.querySelector('.results_tbl');
	if (results.length === 0) {
		results_tbl.innerHTML = '<h2>NO STUDENTS HAVE JOINED THIS CLASS</h2>';
	} else {
		let table = `<table>
		<tr>
			<th colspan="4">RESULTS</th>
		</tr>
		<tr>
			<th>FIRST NAME</th>
			<th>LAST NAME</th>
			<th>EMAIL</th>
			<th>SCORE</th>
		</tr>`;

		for (let row of results) {
			table += `
			<tr>
				<td>${row.FIRST_NAME}</td>
				<td>${row.LAST_NAME}</td>
				<td>${row.EMAIL}</td>
				<td>${row.MARKS}</td>
			</tr>
		`;
		}

		table += '</table>';

		results_tbl.innerHTML = table;
	}
};

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
			if (res.STATUS === 1)
				document.getElementById(
					'name'
				).innerHTML = sessionStorage.getItem('name');
			else window.location = 'signIn.html';
		})
		.catch(error => console.log('error', error));

	quizID = window.location.search
		.substring(1)
		.split('&')
		.map(ele => ele.split('='))[0][1];

	fetch(`${baseURL}/quiz/results?quizID=${quizID}`, requestOptions)
		.then(result => result.json())
		.then(res => {
			if (res.STATUS === 1) {
				document.getElementById('title').innerHTML = res.DATA['TITLE'];
				results = res.DATA['RESULTS'];
				fillTable();
			} else window.location = 'signIn.html';
		})
		.catch(error => console.log('error', error));
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
