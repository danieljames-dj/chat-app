const socketio = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');
const clients = {};

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
					next();
				}
			});
		})
		.on('connection', (socket) => {
			// setInterval(() => {
			// 	socket.emit('data', {
			// 		test: "Abc"
			// 	});
			// }, 2000);
			console.log("Socket connected");
		});
		server.listen(8080);
	}
}