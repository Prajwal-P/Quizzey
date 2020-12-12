const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const user = require('./Routes/user.js');

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
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use('/test', (req, res) => {
	res.json({
		STATUS: 1,
		MESSAGE: 'TEST API',
		DATA: 'SAMPLE RUN'
	});
});

app.use('/user', user);

app.listen(port, () => console.log(`Listening on port ${port}...`));
