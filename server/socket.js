const { db } = require("./mongo-connector");
const http = require('http');
const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongodb");
const clients = {};

// TODO: Remove disconnected clients' socket from clients object

const getUserName = (userId) => {
	return new Promise((resolve, reject) => {
		db.users.findOne({
			_id: ObjectId(userId)
		}).then(result => {
			if (result) {
				resolve(result.username);
			} else {
				resolve("");
			}
		})
	});
}

module.exports = {
	createSocket: (app) => {
		const server = http.createServer(app);
		const io = require('socket.io')(server, {
			cors: {
				origin: '*',
			}
		});
		io.use((socket, next) => {
			jwt.verify(socket.handshake.query.token, process.env.TOKEN_SECRET, function(err, decoded) {
				if (err) {
					next(new Error('Authentication error'));
				} else {
					const user_id = decoded.id;
					clients[user_id] = socket;
					socket.user_id = user_id;
					next();
				}
			});
		})
		.on('connection', (socket) => {
			console.log("Socket connected");
			socket.on('data', async (message) => {
				message.sender_id = socket.user_id;
				message.sender_name = await getUserName(socket.user_id);
				message.timestamp = new Date();
				db.messages.insertOne(message);
				Object.keys(clients).forEach(user_id => {
					if (clients[user_id]) {
						clients[user_id].emit('data', message);
					}
				})
			});
		});
		server.listen(8080);
	}
}