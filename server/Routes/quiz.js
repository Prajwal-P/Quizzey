const express = require('express');
const multer = require('multer');
const upload = multer();
const mysqlConnection = require('../connection');

const sendRes = require('../controllers/sendRes');
const check = require('../middleware/checkUser.js');

const router = express.Router();

let sql;

router.post('/add', check, (req, res) => {
	const data = req.body;
	let classID = data['class_id'];
	let userID = req.cookies.userId;
	let quizID;

	const isTeacher = () => {
		sql = `SELECT * FROM TBL_CLASSROOM WHERE ID='${classID}' AND TEACHER_ID='${userID}';`;
		mysqlConnection.query(sql, (err, result) => {
			if (err) {
				sendRes(-1, res);
			} else {
				if (result.length === 0) {
					sendRes(
						0,
						res,
						undefined,
						'YOU ARE NOT AUTHORISED FOR THIS ACTION'
					);
				} else addQuiz();
			}
		});
	};

	const addQuiz = () => {
		sql = `INSERT INTO TBL_QUIZ(CLASS_ID, TITLE, DESCRIPTION, NO_OF_QUESTIONS, DURATION, MAX_MARKS, START_TIME, END_TIME)
		VALUES('${data['class_id']}', '${data['quiz_title']}', '${data['quiz_description']}', '${data['no_of_questions']}', 
		'${data['duration']}', '${data['max_marks']}', '${data['start_time']}', '${data['end_time']}');`;
		mysqlConnection.query(sql, (err, result) => {
			if (err) {
				sendRes(-1, res);
			} else {
				quizID = result['insertId'];
				insertQuestions()
					.then(msg => {
						console.log(msg);
						sendRes(
							1,
							res,
							{
								QUIZ_ID: quizID,
								QUIZ_TITLE: data['quiz_title']
							},
							'QUIZ ADDED SUCCESFULLY'
						);
					})
					.catch(err => sendRes(-1, res, err));
			}
		});
	};

	const insertQuestions = () => {
		return new Promise(async (resolve, reject) => {
			await data['questions'].map((ele, i) => {
				sql = `INSERT INTO TBL_QUESTION(QUIZ_ID, QUESTION, MARK, NO_OF_CORRECT_ANS) VALUES('${quizID}', '${ele['question']}', '${ele['marks']}', 1);`;
				mysqlConnection.query(sql, async (err, result) => {
					if (err) {
						reject(err);
					} else {
						await insertOptions(ele['options'], result['insertId'])
							.then(msg => console.log(msg))
							.catch(err => reject(err));
					}
					if (i === data['no_of_questions'] - 1)
						resolve('All questions inserted');
				});
			});
		});
	};

	const insertOptions = (options, questionID) => {
		// console.log(options, questionID);
		return new Promise(async (resolve, reject) => {
			await options.map((ele, i) => {
				sql = `INSERT INTO TBL_OPTION(QUESTION_ID, CHOICE, IS_CORRECT) VALUES ('${questionID}', '${ele['option']}', '${ele['is_correct']}')`;
				mysqlConnection.query(sql, (err, result) => {
					if (err) {
						// sendRes(-1, res);
						reject(err);
					}
					if (i == 3) resolve('All options inserted');
				});
			});
		});
	};

	if (
		data['class_id'] &&
		data['quiz_title'] &&
		data['quiz_description'] &&
		data['duration'] &&
		data['no_of_questions'] > 0 &&
		data['max_marks'] &&
		data['start_time'] &&
		data['end_time'] &&
		data['questions'].length === data['no_of_questions']
	) {
		isTeacher();
	} else {
		sendRes(0, res, undefined, 'INSUFFICIENT DATA');
		console.log(data);
	}
});

router.delete('/remove', check, (req, res) => {
	const classID = req.query['classID'];
	const quizID = req.query['quizID'];
	const userID = req.cookies.userId;

	const isTeacher = () => {
		sql = `SELECT * FROM TBL_CLASSROOM WHERE ID='${classID}' AND TEACHER_ID='${userID}';`;
		mysqlConnection.query(sql, (err, result) => {
			if (err) {
				sendRes(-1, res);
			} else {
				if (result.length === 0) {
					sendRes(
						0,
						res,
						undefined,
						'YOU ARE NOT AUTHORISED FOR THIS ACTION'
					);
				} else deleteQuiz();
			}
		});
	};

	const deleteQuiz = () => {
		sql = `DELETE FROM TBL_QUIZ WHERE ID='${quizID}' AND CLASS_ID='${classID}';`;
		mysqlConnection.query(sql, (err, result) => {
			if (err) {
				sendRes(-1, res);
			} else {
				if (result['affectedRows'] === 1)
					sendRes(1, res, undefined, 'QUIZ DELETED SUCCESSFULLY');
				else sendRes(0, res, undefined, 'QUIZ COULD NOT BE REMOVED');
			}
		});
	};

	isTeacher();
});

module.exports = router;
