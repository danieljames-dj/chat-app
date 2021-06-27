const { db } = require("../mongo-connector");
const jwt = require('jsonwebtoken');

module.exports = function(req, res) {
	// TODO: clientside and serverside validation of username and password
	const { username, password } = req.body;
	const expiryTime = 1800;
	db.users.findOne({
		username: username,
		password: password
	}).then(result => {
		if (result) {
			res.status(200).send({
				token: jwt.sign({id: result._id}, process.env.TOKEN_SECRET, { expiresIn: expiryTime }),
				expiry: expiryTime
			});
		} else {
			res.status(400).send("Login failed");
		}
	})
}