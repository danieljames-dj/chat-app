import socketClient from "socket.io-client";

const messages = {};
const chatListener = {};
let socket;

export const connectToSocket = () => {
	socket = socketClient('http://127.0.0.1:8080', {
		query: {
			token: localStorage.getItem('token')
		}
	});
	socket.on('connect', () => {
		console.log('Connected to socket');
	});
	socket.on('connect_error', (error) => {
		console.log('Error connecting to socket', error);
	});
	socket.on('data', (message) => {
		if (chatListener[message.chat_id]) {
			chatListener[message.chat_id](message);
		}
	});
}

export const sendMessage = (chatId, message) => {
	socket.emit('data', {
		chat_id: chatId,
		content: message
	});
}

export const listenToChat = (chatId, callback) => {
	chatListener[chatId] = callback;
}