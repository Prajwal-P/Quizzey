let classroom =
	{
		id: 1,
		title: "Web Technology",
		class_teacher: "Sushma H R",
		description: "Subject Code : 17CS71, Teacher : Sushma H R, Classroom for taking quiz related to HTML, CSS and JS",
		quizzes: [
			{
				id: 1,
				title: "Quiz-1",
				description: "HTML Quiz",
				no_of_questions: 10,
				duration: 20,
				max_marks: 20,
				start_time: new Date(),
				end_time: new Date(),
				score: 18
			},
			{
				id: 2,
				title: "Quiz-2",
				description: "CSS Quiz",
				no_of_questions: 10,
				duration: 10,
				max_marks: 10,
				start_time: new Date(),
				end_time: new Date(),
				score: 7
			},
			{
				id: 3,
				title: "Quiz-3",
				description: "HTML, CSS, JS Quiz",
				no_of_questions: 100,
				duration: 120,
				max_marks: 100,
				start_time: new Date(),
				end_time: new Date()
			},
			{
				id: 4,
				title: "Quiz-4",
				description: "PHP, DBMS Quiz",
				no_of_questions: 30,
				duration: 30,
				max_marks: 30,
				start_time: new Date(),
				end_time: new Date()
			}
		]
	}

let menu_visible = false;
function toggle_dropdown() {
	let dd = document.querySelector('.dd_wrapper')
	if (menu_visible) {
		dd.classList.remove("show");
		menu_visible = false;
	} else {
		dd.classList.add("show");
		menu_visible = true;
	}
}

document.querySelector('.class_card').innerHTML = `
	<div class="class_room">
	<div class="cls_title_and_teacher_name">
		<h2>${classroom.title}</h2>
		<p>${classroom.class_teacher}</p>
	</div>
	<p>${classroom.description}</p>
</div>
`

function quiz_card_template(cl) {
	return `
	<div class="quiz_card">
		<div class="quiz_name_and_marks">
			<h2>${cl.title}</h2>
			<p>MAX MARKS : ${cl.max_marks}</p>
			</div>
		<P>${cl.description}</P>
		<div class="dur_and_no_of_que">
			<p>Duration: ${cl.duration} min</p>
			<p>No. of Questions: ${cl.no_of_questions}</p>
			<button>Take quiz</button>
		</div>
	</div>
	`
}

document.querySelector('.quiz_card_wrapper').innerHTML = `
	${classroom.quizzes.map(quiz_card_template).join('')}
`
