const production = process.env.NODE_ENV === 'production';
!production && require('dotenv').config();

const express = require('express');
const session = require('express-session');
const mongoConnector = require('./mongo-connector');
const cors = require('cors');
const socket = require('./socket');
const port = process.env.PORT || 3000;
const session_secret = process.env.SESSION_SECRET;

const app = express();
!production && app.use(cors({
	origin: 'http://localhost:3000',
	methods:['GET','POST'],
	credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
	secret: session_secret,
	resave: true,
	saveUninitialized: true
}));
socket.createSocket(app);

const authValidation = (req, res, next) => {
	const jwt = require('jsonwebtoken');
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) {
		res.status(401).send();
	}
	jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
		if (err) {
			res.status(500).send();
		} else {
			req.user_id = decoded._id;
			next();
		}
	})
}

app.post('/signin', require('./routes/signin'));
app.post('/signup', require('./routes/signup'));
app.post('/createRoom', authValidation, require('./routes/createRoom'));
app.get('/getRooms', authValidation, require('./routes/getRooms'));
app.get('/chat', authValidation, require('./routes/chat'));
app.get('/getMessages', authValidation, require('./routes/getMessages'));

console.log("Connecting to mongo...");
mongoConnector.connect().then(() => {
	console.log("Connected to mongo successfully");
	app.listen(port, () => {
		console.log(`Started listening to port ${port}`);
	});
}).catch(err => {
	console.log(`Something went wrong in connecting to mongo: ${err}`)
});