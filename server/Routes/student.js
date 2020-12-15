const express = require('express');
const multer = require('multer');
const upload = multer();
const mysqlConnection = require('../connection');

const sendRes = require('../controllers/sendRes');
const check = require('../middleware/checkUser.js');

const router = express.Router();

let sql;

router.get('/allstudents/:classID', check, (req, res) => {
	const classID = req.params['classID'];
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
				} else retriveStudents();
			}
		});
	};

	const retriveStudents = () => {
		sql = `SELECT U.FIRST_NAME, U.LAST_NAME, U.EMAIL
			FROM TBL_USER U, TBL_STUDENT_CLASSROOM S
			WHERE U.ID=S.STUDENT_ID AND S.CLASS_ID='${classID}';`;
		mysqlConnection.query(sql, (err, result) => {
			if (err) {
				sendRes(-1, res);
			} else {
				sendRes(1, res, result);
			}
		});
	};

	isTeacher();
});

module.exports = router;
