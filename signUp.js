let baseURL = 'http://127.0.0.1:8888';

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

let signUpForm = document.getElementById('signUpForm');

signUpForm.addEventListener('submit', e => {
	e.preventDefault();
	if (signUpForm[3].value !== signUpForm[4].value) {
		alert('PASSWORDS DO NOT MATCH');
	} else {
		let data = new FormData();
		for (let i = 0; i < 5; i++) {
			// console.log(signUpForm[i].name, signUpForm[i].value);
			data.append(signUpForm[i].name, signUpForm[i].value);
		}
		// for (let pair of data.entries()) {
		// 	console.log(pair[0] + ', ' + pair[1]);
		// }
		var requestOptions = {
			method: 'POST',
			body: data
		};

		fetch(`${baseURL}/user/signup`, requestOptions)
			.then(result => result.json())
			.then(res => {
				// console.log(res);
				alert(res.MESSAGE);
				if (res.STATUS === 1) {
					window.location = 'signIn.html';
				}
			})
			.catch(error => console.log('error', error));
	}
});
