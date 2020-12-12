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
		console.log(`>>>>>    Handeling connection    <<<<<\n`);
		connection.query(`SELECT * FROM TBL_USER`, (err, result) => {
			if (err) {
				console.log(`Invaild query\nConnection can get terminated\n`);
			} else {
				console.log(`Connection handled\n`);
				// console.log(`Result of query :-\n`);
				// console.log(result);
				// console.log(`\n----------------------------------------\n`);
			}
		});
	}, 1000 * 60 * 4);
}

handleConnection();

module.exports = connection;
