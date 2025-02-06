// api.js (or axios.js)
import axios from 'axios';
import { getCookie } from './functions';


// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Add headers globally for all requests
api.defaults.headers.common['Authorization'] = `Bearer ${getCookie("accessToken")}`;
api.defaults.headers.common['Content-Type'] = 'application/json';

export default api;
