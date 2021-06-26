import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './views/Home/Home';
import Auth from './views/Auth/Auth';
import Chat from './views/Chat/Chat';
import Spinner from 'react-bootstrap/Spinner';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom';
import LoadingContext from './contexts/LoadingContext';
import React, { useState } from 'react';

function App() {
	const [isLoading, setIsLoading] = useState(false);
	return (
		// TODO: If user is logged in, and if user is at login page, redirect to chat page and similarly, if user is at chat page and if not logged in, redirect to login page.
		<Router>
			<div className="App-background">
				<div className="Widget-background">
					<LoadingContext.Provider value={setIsLoading}>
						<Switch>
							<Route exact path="/">
								<Home></Home>
							</Route>
							<Route exact path="/auth">
								<Auth></Auth>
							</Route>
							<Route exact path="/chat">
								<Chat></Chat>
							</Route>
						</Switch>
					</LoadingContext.Provider>
				</div>
				{
					isLoading &&
					<div className="App-loading">
						<Spinner className="App-spinner" animation="border" />
					</div>
				}
			</div>
		</Router>
	);
}

export default App;
