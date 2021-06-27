import './ChatList.css';
import { useHistory } from 'react-router-dom';
import {
	Tab,
	Tabs,
	Button,
	Card,
	ListGroup
} from 'react-bootstrap';
import { useRef, useState, useContext, useEffect } from 'react';
import AxiosInstance from '../../utils/AxiosInstance';
import LoadingContext from '../../contexts/LoadingContext';
import socketClient from "socket.io-client";

function ChatList() {

	const setIsLoading = useContext(LoadingContext);
	const keys = {
		chatRoom: "chatRoom",
		directChat: "directChat"
	};
	const [key, setKey] = useState("chatroom");
	const history = useHistory();
	const newRoom = useRef(null);
	const username = useRef(null);
	const [chatGroups, setChatGroups] = useState([]);

	useEffect(() => {
		const socket = socketClient('http://127.0.0.1:8080', {
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
		socket.on('data', () => {
			console.log("Hello");
		});
		fetchChats();
	}, []);

	function createRoom() {
		setIsLoading(true);
		AxiosInstance.post('/createRoom', {
			roomName: newRoom.current.value
		})
		.then(response => {
			setIsLoading(false);
			history.push('/chat/' + response.data.chatId);
		})
		.catch(err => {
			setIsLoading(false);
			alert(err);
		})
	}

	function directChat() {
		//
	}

	function fetchChats() {
		AxiosInstance.get('/getRooms', {})
		.then(result => {
			setChatGroups(result.data);
		})
	}

	function openChat(chat) {
		history.push('/chat/' + chat._id);
	}

	return (
		<div>
		<Tabs defaultActiveKey={keys.chatRoom} onSelect={setKey}>
			<Tab eventKey={keys.chatRoom} title="Chat Room">
				<Card className="Chat-new">
					<Card.Body>
						<Card.Title>New Room</Card.Title>
						<Card.Text>
							<input ref={newRoom} placeholder="Enter room name"></input>
						</Card.Text>
						<Button variant="primary" onClick={createRoom}>Create</Button>
					</Card.Body>
				</Card>
				<h3 style={{textAlign: 'left'}}>Public Rooms</h3>
				<div className="Chat-list">
					<ListGroup>
						{
							chatGroups.map((chatGroup) => (
								<ListGroup.Item onClick={openChat.bind(this, chatGroup)}>
									{chatGroup.chatName}
								</ListGroup.Item>
							))
						}
					</ListGroup>
				</div>
			</Tab>
			<Tab eventKey={keys.directChat} title="Direct Chat">
				<Card className="Chat-new">
					<Card.Body>
						<Card.Title>New Chat</Card.Title>
						<Card.Text>
							<input ref={username} placeholder="Enter username"></input>
						</Card.Text>
						<Button variant="primary" onClick={directChat}>Chat</Button>
					</Card.Body>
				</Card>
			</Tab>
		</Tabs>
		</div>
	);
}

export default ChatList;