const { db } = require("../mongo-connector");

module.exports = function(req, res) {
	db.users.findOne({
		username: req.body.username,
		password: req.body.password
	}).then(result => {
		if (result) {
			res.status(200).send();
		} else {
			res.status(400).send("Login failed");
		}
	})
}