let baseURL = 'http://127.0.0.1:8888';
// let baseURL = 'http://localhost:8888';

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
			if (res.STATUS === 1) window.location = 'dashboard.html';
		})
		.catch(error => console.log('error', error));
};

let signInForm = document.getElementById('signInForm');

signInForm.addEventListener('submit', e => {
	e.preventDefault();

	let data = new FormData();

	for (let i = 0; i < 2; i++) {
		data.append(signInForm[i].name, signInForm[i].value);
	}

	var requestOptions = {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		body: data
	};

	fetch(`${baseURL}/user/signIn`, requestOptions)
		.then(result => result.json())
		.then(res => {
			// console.log(res);
			if (res.STATUS === 1) {
				sessionStorage.setItem('name', res.DATA['USER_NAME']);
				window.location = 'dashboard.html';
			} else {
				alert(res.MESSAGE);
			}
		})
		.catch(error => console.log('error', error));
});
