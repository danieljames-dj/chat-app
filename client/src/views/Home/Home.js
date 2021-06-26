import './Home.css';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';

function Home() {
	const history = useHistory();
	function enterApp() {
		// TODO: Check if user is already logged in
		history.push('/auth');
		// setIsLoading(true);
	}
	return (
		<div>
			<h1 className="Home-heading">Welcome to Chat App</h1>
			<Button className="Home-button" variant="secondary" size="lg" onClick={enterApp}>Enter App</Button>
		</div>
	);
}

export default Home;