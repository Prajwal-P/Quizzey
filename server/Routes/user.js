const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer();
const mysqlConnection = require('../connection');

const sendRes = require('../controllers/sendRes');
const check = require('../middleware/checkUser.js');

const router = express.Router();

let sql;

router.post('/signUp', upload.none(), (req, res) => {
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

router.post('/signIn', upload.none(), (req, res) => {
	const { email, password } = req.body;

	const _userId = req.cookies.userId;
	const _authToken = req.cookies.authToken;
	let userId, userName;

	const fetchUser = () => {
		if (email && password) {
			sql = `SELECT ID, FIRST_NAME, PASSWORD FROM TBL_USER WHERE EMAIL='${email}'`;
			mysqlConnection.query(sql, (e, r) => checkUser(e, r));
		} else {
			sendRes(0, res, undefined, 'INSUFFICIENT DATA');
		}
	};

	const checkUser = (err, result) => {
		if (err) {
			console.log(err);
		} else {
			if (result.length === 0) {
				sendRes(0, res, undefined, 'INVALID USERNAME OR PASSWORD');
			} else {
				userId = result[0]['ID'];
				userName = result[0]['FIRST_NAME'];
				// console.log('User ID: ', userId);
				bcrypt.compare(password, result[0]['PASSWORD'], (e, r) =>
					checkPassword(e, r)
				);
			}
		}
	};

	const checkPassword = (err, result) => {
		if (result) {
			// userId = result[0]['USER_ID'];
			// console.log('User ID: ', userId);
			if (userId !== parseInt(_userId)) {
				console.log('Logging in new user...');
			}
			if (_authToken) {
				// console.log('Query with auth token');
				sql = `SELECT VALIDITY FROM TBL_USER_AUTH WHERE USER_ID='${userId}' AND AUTH_ID='${_authToken}';`;
			} else {
				// console.log('Query w/o auth token');
				sql = `SELECT VALIDITY FROM TBL_USER_AUTH WHERE USER_ID='${userId}';`;
			}
			mysqlConnection.query(sql, (e, r) => checkAuthToken(e, r));
		} else {
			sendRes(0, res, undefined, 'INVALID USERNAME OR PASSWORD');
		}
	};

	// Check auth token of DB
	const checkAuthToken = (err, result) => {
		if (err) {
			sendRes(-1, res);
		} else {
			// TODO create new validity datetime
			let d = new Date();
			d.setHours(d.getHours() + 24);
			let validity = d.toISOString().slice(0, 19).replace('T', ' ');

			// console.log('Cookie authToken: ',_authToken);
			// console.log('Result len of tokens: ', result.length);
			if (result.length === 0 && _authToken) {
				res.clearCookie('userId').clearCookie('authToken');
				sendRes(0, res, undefined, 'UNAUTHORISED');
			} else {
				if (!_authToken) {
					console.log('Generating new token');
					sql = `INSERT INTO TBL_USER_AUTH (USER_ID, VALIDITY) VALUES ('${userId}', '${validity}');`;
				} else {
					console.log('Updating token');
					sql = `UPDATE TBL_USER_AUTH SET VALIDITY='${validity}' WHERE USER_ID='${userId}' AND AUTH_ID='${_authToken}';`;
				}
				mysqlConnection.query(sql, (e, r) => {
					if (e) {
						// console.log((e));
						sendRes(-1, res);
					} else {
						// console.log(r);

						res.cookie('userId', userId, {
							SameSite: 'Lex',
							httpOnly: true
							// secure: true
							// maxAge: 1000 * 60 * 60 * 2
						}).cookie(
							'authToken',
							_authToken ? _authToken : r['insertId'],
							{
								SameSite: 'Lex',
								httpOnly: true
								// secure: true
								// maxAge: 1000 * 60 * 60 * 2
							}
						);

						let data = {
							USER_ID: userId,
							USER_NAME: userName
						};
						sendRes(1, res, data);
					}
				});
			}
			// else {
			// 	sendRes(1, res)
			// }
		}
	};

	fetchUser();
});

router.get('/signOut', check, (req, res) => {
	res.clearCookie('userId').clearCookie('authToken');
	sendRes(1, res);
});

router.get('/check', check, (req, res) => {
	data = {
		USER_ID: parseInt(req.cookies.userId)
	};
	sendRes(1, res);
});

module.exports = router;
