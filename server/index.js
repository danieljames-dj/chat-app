process.env.NODE_ENV !== 'production' && require('dotenv').config();

const express = require('express');
const session = require('express-session');
const mongoConnector = require('./mongo-connector');
const port = process.env.PORT || 3000;
const session_secret = process.env.SESSION_SECRET;

const app = express();
app.use(session({
	secret: session_secret,
	resave: true,
	saveUninitialized: true
}));

app.get('/', (req, res) => {
	res.send('Hello World!')
});

console.log("Connecting to mongo...");
mongoConnector.connect().then(() => {
	console.log("Connected to mongo successfully");
	app.listen(port, () => {
		console.log(`Started listening to port ${port}`);
	});
}).catch(err => {
	console.log(`Something went wrong in connecting to mongo: ${err}`)
});