const express = require('express');
const multer = require('multer');
const upload = multer();
const mysqlConnection = require('../connection');

const sendRes = require('../controllers/sendRes');
const check = require('../middleware/checkUser.js');

const router = express.Router();

let sql;

router.post('/add', check, upload.none(), (req, res) => {
	const { class_title, class_desc } = req.body;
	const teacherId = req.cookies.userId;
	let classCode = '';

	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const generateString = length => {
		let result = '';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}
		return result;
	};

	const generateClassCode = () => {
		if (class_title && class_desc) {
			classCode = generateString(7);
			console.log(classCode);
			sql = `SELECT CLASS_CODE FROM TBL_CLASSROOM;`;
			mysqlConnection.query(sql, (err, result) => {
				if (err) {
					sendRes(-1, res);
				} else {
					if (result.length === 0) {
						insertClass();
					} else {
						let i = 0,
							n = result.length,
							flag = false;
						while (i < result.length) {
							if (result[i]['CLASS_CODE'] === classCode) {
								console.log('\nClass code repeated\n');
								classCode = generateString(7);
								i = 0;
							} else {
								if (i === result.length - 1) flag = true;
								i++;
							}
						}
						if (flag) insertClass();
					}
				}
			});
		} else {
			sendRes(0, res, undefined, 'INSUFFICIENT DATA');
		}
	};

	const insertClass = () => {
		sql = `INSERT INTO TBL_CLASSROOM(TEACHER_ID, TITLE, DESCRIPTION, CLASS_CODE) VALUES ('${teacherId}', '${class_title}', '${class_desc}', '${classCode}');`;
		mysqlConnection.query(sql, (err, result) => {
			if (err) {
				sendRes(-1, res);
			} else {
				sendRes(
					1,
					res,
					{
						className: class_title,
						classID: result['insertId']
					},
					'CLASSROOM SUCCESSFULLY CREATED'
				);
			}
		});
	};

	generateClassCode();
});

router.post('/join', check, upload.none(), (req, res) => {
	const { classCode } = req.body;
	const studentID = req.cookies.userId;
	let classID;

	const getClassID = () => {
		sql = `SELECT ID, TEACHER_ID FROM TBL_CLASSROOM WHERE CLASS_CODE='${classCode}'`;
		mysqlConnection.query(sql, (err, result) => {
			if (err) {
				sendRes(-1, res);
			} else {
				if (result.length === 0) {
					sendRes(1, res, undefined, 'INVALID CLASS CODE');
				} else {
					classID = result[0]['ID'];
					if (studentID != result[0]['TEACHER_ID']) joinStudent();
					else
						sendRes(
							1,
							res,
							undefined,
							'YOU ARE THE OWNER OF THE CLASS, JOINING THE CLASS IS NOT NECESSARY'
						);
				}
			}
		});
	};

	const joinStudent = () => {
		sql = `INSERT INTO TBL_STUDENT_CLASSROOM(STUDENT_ID, CLASS_ID) VALUES ('${studentID}', '${classID}');`;
		mysqlConnection.query(sql, (err, result) => {
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					sendRes(1, res, undefined, 'CLASSROOM ALREADY JOINED');
				} else {
					sendRes(-1, res);
				}
			} else {
				sendRes(
					1,
					res,
					{ classID: classID },
					'JOINED CLASS SUCCESSFULLY'
				);
			}
		});
	};

	getClassID();
});

router.get('/', check, upload.none(), (req, res) => {
	let userID = req.cookies.userId;

	let sql = `SELECT CLS.ID, CLS.TITLE, CLS.DESCRIPTION 
	FROM TBL_CLASSROOM CLS 
	WHERE CLS.TEACHER_ID = ${userID} OR 
	CLS.ID = (SELECT TBL_STUDENT_CLASSROOM.CLASS_ID 
			FROM TBL_STUDENT_CLASSROOM 
			WHERE TBL_STUDENT_CLASSROOM.STUDENT_ID = ${userID})
	ORDER BY CLS.LAST_UPDATE, CLS.TITLE, CLS.ID;`;

	mysqlConnection.query(sql, (err, result) => {
		if (err) {
			sendRes(-1, res);
		} else {
			if (result.length === 0) {
				sendRes(1, res, result, 'NO CLASSROOMS JOINED');
			} else {
				sendRes(1, res, result);
			}
		}
	});
});

module.exports = router;
