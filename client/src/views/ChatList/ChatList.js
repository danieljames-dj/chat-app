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
import { connectToSocket } from '../../data/SocketConnection';

function ChatList() {

	const setIsLoading = useContext(LoadingContext);
	const keys = {
		chatRoom: "chatRoom",
		directChat: "directChat",
		signOut: "signOut"
	};
	const [key, setKey] = useState("chatroom");
	const history = useHistory();
	const newRoom = useRef(null);
	const roomName = useRef(null);
	const username = useRef(null);
	const [chatGroups, setChatGroups] = useState([]);

	useEffect(() => {
		connectToSocket();
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

	function enterRoom() {
		AxiosInstance.get('/getRooms', {
			params: {
				chatName: roomName.current.value
			}
		})
		.then(result => {
			if (result.data.length == 1) {
				history.push('/chat/' + result.data[0]._id);
			} else {
				alert("Room doesn't exist");
			}
		});
	}

	function signOut() {
		localStorage.clear();
		history.push('/');
	}

	function tabListener(key) {
		if (key == keys.signOut) {
			signOut();
		} else {
			setKey(key);
		}
	}

	function directChat() {
		//
	}

	function fetchChats() {
		AxiosInstance.get('/getRooms', {})
		.then(result => {
			setChatGroups(result.data);
		});
	}

	function openChat(chat) {
		history.push('/chat/' + chat._id);
	}

	return (
		<div>
		<Tabs defaultActiveKey={keys.chatRoom} onSelect={tabListener}>
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
				<Card className="Chat-new">
					<Card.Body>
						<Card.Title>Enter Room</Card.Title>
						<Card.Text>
							<input ref={roomName} placeholder="Enter room name"></input>
						</Card.Text>
						<Button variant="primary" onClick={enterRoom}>Enter</Button>
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
			<Tab eventKey={keys.directChat} title="Direct Chat" disabled>
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
			<Tab eventKey={keys.signOut} title="Sign Out">
			</Tab>
		</Tabs>
		</div>
	);
}

export default ChatList;