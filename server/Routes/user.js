const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer();
const mysqlConnection = require('../connection');

const sendRes = require('../controllers/sendRes');

const router = express.Router();

let sql;

router.post('/signup', upload.none(), function (req, res) {
	const { first_name, last_name, email, password } = req.body;
	if (first_name && last_name && email && password) {
		bcrypt.hash(password, 10, (err, hash) => {
			if (err) {
				console.log('ERROR IN GENERATING HASH');
				console.log(err);
				sendRes(-1, res);
			} else {
				sql = `INSERT INTO TBL_USER(FIRST_NAME, LAST_NAME, EMAIL, PASSWORD)
					VALUES('${first_name}', '${last_name}', '${email}', '${hash}');`;
				mysqlConnection.query(sql, function (err, result) {
					if (err) {
						if (err.code === 'ER_DUP_ENTRY') {
							sendRes(
								0,
								res,
								undefined,
								'EMAIL ALREADY EXISTS, PLEASE LOGIN'
							);
						} else {
							console.log(err);
							sendRes(-1, res);
						}
					} else {
						sendRes(
							1,
							res,
							undefined,
							'USER REGISTERED SUCCESSFULLY'
						);
					}
				});
			}
		});
	} else {
		sendRes(0, res, undefined, 'INSUFFICIENT DATA');
	}
});

module.exports = router;
