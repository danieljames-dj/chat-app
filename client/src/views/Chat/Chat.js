import './Chat.css';
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from '../../utils/AxiosInstance';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { listenToChat, sendMessage } from '../../data/SocketConnection';

function Chat() {
	const params = useParams();
	const chat_id = params.id;
	const [messages, setMessages] = useState([]);
	const message = useRef(null);

	useEffect(() => {
		fetchMessages();
		listenToChat(chat_id, (newMessage) => {
			pushMessage(newMessage);
		});
	}, []);

	function pushMessage(newMessage) {
		setMessages(messages => {
			return [...messages, newMessage];
		});
	}

	function send() {
		sendMessage(chat_id, message.current.value);
		message.current.value = "";
	}

	function fetchMessages() {
		AxiosInstance.get('/getMessages', {
			params: {
				chat_id: chat_id
			}
		})
		.then(result => {
			setMessages([...result.data]);
		});
	}

	return (
		<div>
			<Card className="Chat-new">
				<Card.Body>
					<Card.Title>New Message</Card.Title>
					<Card.Text>
						<input ref={message} placeholder="Enter message"></input>
					</Card.Text>
					<Button variant="primary" onClick={send}>Send</Button>
				</Card.Body>
			</Card>
			<div className="chatMessage">
				<ListGroup>
					{
						messages.map((message) => (
							<ListGroup.Item>
								<b>{message.sender_name}: </b>
								{message.content}
							</ListGroup.Item>
						))
					}
				</ListGroup>
			</div>
		</div>
	);
}

export default Chat;