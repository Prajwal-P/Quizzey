// sendRes
// Sends response to frontend
// Input: status code = s, response object, data to be sent
// Output: Sends response to user
// if s == 0 => Unauthorised
// if s == 1 => Success
// else Error on Server side
module.exports = (s, res, data, msg) => {
	if (s == 1) {
		res.status(200).json({
			STATUS: 1,
			MESSAGE: msg || 'SUCCESS',
			DATA: data
		});
	} else if (s == 0) {
		res.status(401).json({
			STATUS: 0,
			MESSAGE: msg || 'FAILURE',
			DATA: data
		});
	} else {
		res.status(500).json({
			STATUS: 0,
			MESSAGE: msg || 'ERROR ON SERVER SIDE, PLEASE TRY AGAIN'
		});
	}
};
