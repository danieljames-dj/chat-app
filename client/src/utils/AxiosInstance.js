import axios from 'axios';

axios.defaults.withCredentials = true;
const instance = axios.create({
	baseURL: 'http://localhost:3001'
});

export default instance;