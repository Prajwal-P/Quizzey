let all_classrooms = [
	{
		id: 1,
		name: "Web Technology",
		description: "Subject Code : 17CS71, Teacher : Sushma H R, Classroom for taking quiz related to HTML, CSS and JS"
	},
	{
		id: 2,
		name: "Advanced Computer Architecture",
		description: "Subject Code : 17CS72, Teacher : Hemavathi, Classroom for taking quiz related to ACA"
	},
	{
		id: 3,
		name: "ML",
		description: "Subject Code : 17CS73, Teacher : Asha T"
	},
	{
		id: 4,
		name: "UNIX",
		description: "Teacher : Divyashree, Classroom for taking quiz related to unix"
	},
	{
		id: 5,
		name: "SAN",
		description: "Teacher : Nikhitha"
	},
	{
		id: 6,
		name: "Web Technology lab and Mini-project",
		description: ""
	},
	{
		id: 7,
		name: "ML LAb",
		description: "Teacher : Madhuri, Classroom for taking quiz related to ML lab"
	}
]

function cls_template(cls) {
	return `
		<div class="class_card">
			<h2>${cls.name}</h2>
			<hr />
			<span>
				${cls.description}
			</span>
		</div>
	`
}

document.querySelector('.class_card_wrapper').innerHTML = `
	${all_classrooms.map(cls_template).join('')}
`

let menu_visible = false;
function toggle_dropdown() {
	// let dd = document.getElementById("dropdown");
	let dd = document.querySelector('.dd_wrapper')
	if (menu_visible) {
		dd.classList.remove("show");
		menu_visible = false;
	} else {
		dd.classList.add("show");
		menu_visible = true;
	}
}

let modal1_visible = false;
function toggle_modal_1() {
	let modal = document.querySelector('.modal-bg')
	if (modal1_visible) {
		modal.classList.remove('show-modal1');
		modal1_visible = false
	} else {
		modal.classList.add('show-modal1');
		modal1_visible = true
	}
}

let modal2_visible = false;
function toggle_modal_2() {
	let modal = document.querySelector('.modal-bg')
	if (modal2_visible) {
		modal.classList.remove('show-modal2');
		modal2_visible = false
	} else {
		modal.classList.add('show-modal2');
		modal2_visible = true
	}
}