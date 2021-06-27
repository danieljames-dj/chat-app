const { db } = require("../mongo-connector");

module.exports = function(req, res) {
	const chat = {
		chatName: req.body.roomName,
		chatType: 'room'
	};
	db.chats.find({
		chatType: 'room'
	}).toArray()
		.then(roomList => {
			res.status(200).send(roomList);
			console.log(result);
	})
}