const { db } = require("../mongo-connector");

module.exports = function(req, res) {
	db.chats.find({
		chatType: 'room'
	}).toArray()
		.then(roomList => {
			res.status(200).send(roomList);
	})
}