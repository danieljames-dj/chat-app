import './Auth.css';
import {
	Tabs,
	Tab
} from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';
import { useContext, useRef } from 'react';
import EncryptPassword from '../../utils/EncryptPassword';
import LoadingContext from '../../contexts/LoadingContext';
import AxiosInstance from '../../utils/AxiosInstance';
import { useHistory } from 'react-router-dom';

function Auth() {

	const setIsLoading = useContext(LoadingContext);
	const history = useHistory();

	function signIn(usernameInput, passwordInput) {
		const username = usernameInput.current.value;
		setIsLoading(true);
		EncryptPassword(passwordInput.current.value)
			.then(password => AxiosInstance.post('/signin', {
				username: username,
				password: password
			}))
			.then(_ => {
				setIsLoading(false);
				history.push('/chat');
			})
			.catch(() => {
				setIsLoading(false);
				alert("Sign in failed. Please try again.");
			})
	}

	function signUp(usernameInput, passwordInput) {
		const username = usernameInput.current.value;
		setIsLoading(true);
		EncryptPassword(passwordInput.current.value)
			.then(password => AxiosInstance.post('/signup', {
				username: username,
				password: password
			}))
			.then(_ => {
				setIsLoading(false);
				history.push('/chat');
			})
			.catch((err) => {
				setIsLoading(false);
				if (err.response && err.response.data) {
					alert(err.response.data);
				} else {
					alert(err);
				}
			})
	}

	function AuthForm(props) {
		// For now, using same form for both sign in and sign up, so reusing the code. Will split it into two forms if sign up requires more field
		const username = useRef(null);
		const password = useRef(null);
		return (
			<Form className="Auth-form">
				<Form.Group className="mt-3">
					<Form.Label>Username</Form.Label>
					<Form.Control type="text" ref={username} placeholder="Enter username" autoComplete="on"/>
				</Form.Group>
				<Form.Group className="mt-3">
					<Form.Label>Password</Form.Label>
					<Form.Control type="password" ref={password} placeholder="Enter password" autoComplete="on"/>
				</Form.Group>
				<Button className="mt-3" variant="primary" onClick={props.listener.bind(this, username, password)}>{props.button}</Button>
			</Form>
		);
	}

	return (
		<Tabs defaultActiveKey="signin">
			<Tab eventKey="signin" title="Sign In">
				<AuthForm button="Sign In" listener={signIn}></AuthForm>
			</Tab>
			<Tab eventKey="signup" title="Sign Up">
				<AuthForm button="Sign Up" listener={signUp}></AuthForm>
			</Tab>
		</Tabs>
	);
}

export default Auth;