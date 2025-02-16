import axios from "axios";
import { getCookie } from "../utils/functions";

let cookies = getCookie("accessToken");
axios.defaults.baseURL = "http://192.168.20.1:3000/";
axios.defaults.headers.post["Content-Type"] = "application/json";
if (cookies) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + cookies;
}

axios.interceptors.response.use(
  // If the response is successful, just return it
  (response) => response,

  // Error handler
  (error) => {
    // Check if the error is due to unauthorized access (401 status)
    if (error.response && error.response.status === 401) {
      // Trigger logout
      // logout();

      // Optionally, you can redirect to login page or show a message
      // window.location.href = '/login';

      // Reject the promise to prevent further processing
      return Promise.reject(error);
    }

    // For other types of errors, just reject the promise
    return Promise.reject(error);
  }
);
