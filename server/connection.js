const mysql = require('mysql');
const queries = require('./tables');

let connection = mysql.createConnection({
	host: 'remotemysql.com',
	user: 'pOI1GSeR6N',
	password: 'JudUvO4ov3',
	database: 'pOI1GSeR6N'
});

connection.connect(err => {
	if (err) {
		console.log('Database not connected');
	} else {
		queries.map((query, i) => {
			connection.query(query, (err, result) => {
				// if (err) console.log(`Table ${i} :-\n${err}`);
				// else console.log(`Table ${i} :-\n${result}`);
				if (i === queries.length - 1) {
					console.log('\nDatabase connected...\n');
				}
			});
		});
	}
});

function handleConnection() {
	setInterval(() => {
		console.log(`>>>>>    Handling connection    <<<<<\n`);
		connection.query(`SELECT * FROM TBL_USER_AUTH`, (err, result) => {
			if (err) {
				console.log(`Invaild query\nConnection can get terminated\n`);
			} else {
				if (result.length === 0) {
					console.log(`Connection handled\n`);
				} else {
					const deleteRow = id => {
						let sql = `DELETE FROM TBL_USER_AUTH WHERE AUTH_ID='${id}';`;
						connection.query(sql, (err, r1) => {
							if (err) {
								console.log(`\nERROR IN DELETING ROW: ${id}`);
							} else {
								// console.log(
								// 	`AUTH TOKEN DELETED WITH ID: ${id}`
								// );
							}
						});
					};

					let yesterday = new Date();
					yesterday.setHours(yesterday.getHours() - 24);
					result.map(row => {
						dt = new Date(row['VALIDITY']);
						let timezone = dt.getTimezoneOffset();
						let hr = parseInt(timezone / -60);
						let min = timezone % -60;
						min *= -1;
						dt.setHours(dt.getHours() + hr);
						dt.setMinutes(dt.getMinutes() + min);
						// console.log(dt);
						if (dt < yesterday) deleteRow(row['AUTH_ID']);
					});
					console.log(`Connection handled\n`);
					// console.log(`Result of query :-\n`);
					// console.log(result);
					// console.log(`\n----------------------------------------\n`);
				}
			}
		});
	}, 1000 * 60 * 4);
}

handleConnection();

module.exports = connection;
