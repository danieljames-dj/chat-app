const { db } = require("../mongo-connector");

module.exports = function(req, res) {
	db.messages.find({
		chat_id: req.query.chat_id
	}).toArray()
		.then(messageList => {
			res.status(200).send(messageList);
	})
}