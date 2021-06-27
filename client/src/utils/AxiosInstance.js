import axios from 'axios';
import { useHistory } from 'react-router-dom';

const token = localStorage.getItem('token');

axios.defaults.withCredentials = true;
const instance = axios.create({
	baseURL: 'http://localhost:3001'
});

if (token) {
	instance.interceptors.request.use(function (config) {
		config.headers.authorization = "Bearer " + token;
		return config;
	});
}

instance.interceptors.response.use((response) => response, (error) => {
	if(error.response.status == 401) {
		localStorage.clear();
		window.location.replace('/auth');
	}
	throw error;
});

export default instance;