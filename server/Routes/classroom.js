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

module.exports = router;