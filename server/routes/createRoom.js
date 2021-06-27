const { db } = require("../mongo-connector");

module.exports = function(req, res) {
	// TODO: clientside and serverside validation of room name
	const chat = {
		chatName: req.body.roomName,
		chatType: 'room'
	};
	db.chats.findOne(chat)
		.then(result => {
			if (result) {
				res.status(400).send("User already exists");
			} else {
				db.chats.insertOne(chat)
					.then((result) => {
						if (result && result.ops && result.ops[0]) {
							res.status(200).send({
								chatId: result.ops[0]._id
							});
						} else {
							res.status(500).send("Something went wrong in server");
						}
					});
			}
	})
}