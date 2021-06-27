const { db } = require("../mongo-connector");

module.exports = function(req, res) {
	const condition = {
		chatType: 'room'
	};
	req.query.chatName && (condition.chatName = req.query.chatName);
	db.chats.find(condition).toArray()
		.then(roomList => {
			res.status(200).send(roomList);
	})
}