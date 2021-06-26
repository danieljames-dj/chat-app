const { MongoClient } = require('mongodb');
const mongoUri = process.env.MONGO_URI;

module.exports.db = {};

module.exports.connect = () => {
	return new Promise((resolve, reject) => {
		const client = new MongoClient(mongoUri, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		client.connect((err) => {
			if (!err) {
				const db = client.db();
				Object.assign(module.exports.db, {
					users: db.collection('users'),
					messages: db.collection('messages'),
					chats: db.collection('chats')
				})
				resolve();
			} else {
				reject(err);
			}
		});
	});
}