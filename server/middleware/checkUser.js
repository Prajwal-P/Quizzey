const sendRes = require('../controllers/sendRes');
const mysqlConnection = require('../connection');

module.exports = (req, res, next) => {
	let userId = req.cookies.userId;
	let authId = req.cookies.authToken;

	if (userId && authId) {
		let sql = `SELECT VALIDITY FROM TBL_USER_AUTH WHERE USER_ID='${userId}' AND AUTH_ID='${authId}';`;
		mysqlConnection.query(sql, (err, result) => {
			if (err) {
				sendRes(-1, res);
			} else {
				if (result.length === 0) {
					res.clearCookie('userId').clearCookie('authToken');
					sendRes(0, res);
				} else {
					let exp = result[0]['VALIDITY'];
					let timezone = exp.getTimezoneOffset();
					let hr = parseInt(timezone / -60);
					let min = timezone % -60;
					min *= -1;
					// console.log(hr, min);
					exp.setHours(exp.getHours() + hr);
					exp.setMinutes(exp.getMinutes() + min);
					// console.log(exp);
					let now = new Date();
					if (now <= exp) {
						next();
					} else {
						sendRes(0, res, undefined, 'SESSION TIMED OUT');
					}
				}
			}
		});
	} else {
		sendRes(0, res);
	}
};
