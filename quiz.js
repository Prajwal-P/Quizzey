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

const start_minutes = 120;
let time = start_minutes * 60;

const count_down = document.getElementById('countdown');

setInterval(updateCountdown, 1000);

function updateCountdown() {
	let hours = Math.floor(time / 3600);
	let minutes = Math.floor(time / 60);
	minutes %= 60;
	let seconds = time % 60;

	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;

	count_down.innerHTML = `${hours} : ${minutes} : ${seconds}`;
	time--;
}
