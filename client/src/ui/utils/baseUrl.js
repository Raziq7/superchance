// import axios from 'axios';
// import { getCookie } from './functions';  // Make sure getCookie is correctly implemented

// // Create an Axios instance with a base URL
// const api = axios.create({
//   baseURL: 'http://15.206.178.245',  // Your API base URL
// });

// // Add Authorization and Content-Type headers globally
// const accessToken = getCookie("accessToken");
// if (accessToken) {
//   api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
// }
// api.defaults.headers.common['Content-Type'] = 'application/json';

// export default api;


import axios from 'axios';
import { getCookie } from './functions';  // Make sure getCookie is correctly implemented

// Create an Axios instance with a base URL
const api = axios.create({
  // baseURL: 'http://localhost:8000',  // Your API base URL
  baseURL: 'https://superchance1.onrender.com',
});

// Add Authorization and Content-Type headers globally
const accessToken = getCookie("accessToken");
if (accessToken) {
  api.defaults.headers.common['Authorization'] =` Bearer ${accessToken}`;
}
api.defaults.headers.common['Content-Type'] = 'application/json';

export default api;