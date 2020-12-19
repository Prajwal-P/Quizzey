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
	<span class="material-icons">delete</span>
	<input class="question" type="text" name="question" required>
	<label for="mark">Mark(s) : </label>
	<input class="question" type="number" style="width: 100px;" name="mark" required>
	<br>
	<label for="options">Options : </label><br>
	<input class="checks" type="radio" name="option" required>
	<input class="txt_field" style="margin: 4px 16px 0 0;" type="text" name="option_1" required>
	<input class="checks" type="radio" name="option">
	<input class="txt_field" type="text" name="option_2" required>
	<input class="checks" type="radio" name="option">
	<input class="txt_field" style="margin-right: 16px;" type="text" name="option_3" required>
	<input class="checks" type="radio" name="option">
	<input class="txt_field" type="text" name="option_4" required>`;

	document.getElementById('addQuizForm').appendChild(node);
}

function deleteQuestion() {}
