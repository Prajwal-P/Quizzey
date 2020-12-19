const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const user = require('./Routes/user.js');
const classroom = require('./Routes/classroom.js');
const student = require('./Routes/student.js');
const quiz = require('./Routes/quiz.js');

const port = process.env.PORT || 8888;

let app = express();

app.use(cookieParser());

let corsOption = {
	origin: true,
	methods: 'GET, POST, DELETE, PUT, PATCH, HEAD',
	credentials: true,
	exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));
// Cross-Origin support for the app
app.use(function (req, res, next) {
	// res.header('Access-Control-Allow-Credentials', true);
	// res.header(
	// 	'Access-Control-Allow-Methods',
	// 	'GET,PUT,POST,DELETE,UPDATE,OPTIONS'
	// );
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	// res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
	);
	next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/test', (req, res) => {
	res.json({
		STATUS: 1,
		MESSAGE: 'TEST API',
		DATA: 'SAMPLE RUN'
	});
});

app.use('/user', user);
app.use('/classroom', classroom);
app.use('/student', student);
app.use('/quiz', quiz);

app.listen(port, () => console.log(`Listening on port ${port}...`));
