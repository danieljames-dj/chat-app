import { useContext } from "react";
import { useParams } from "react-router-dom";
import LoadingContext from "../../contexts/LoadingContext";
import AxiosInstance from '../../utils/AxiosInstance';

function Chat() {
	const params = useParams();
	const setIsLoading = useContext(LoadingContext);
	// setIsLoading(true);
	// AxiosInstance.get('/chat');
	console.log(params);
	return (
		<div>
			<h1>Hello World</h1>
		</div>
	);
}

export default Chat;