import axios from "../utils/baseUrl";  // Import axios with base configuration

export const login_user = async function (body) {
  try {
    // Send login request with the body data directly
    const { data } = await axios.post("/api/auth/login", body);
    return data;
  } catch (error) {
    console.log("Error on API login", error);
    return error.response ? error.response.data : error;
  }
};

export const logout_user = async function () {
  try {
    // Send logout request
    const { data } = await axios.post("/api/auth/logout");
    return data;
  } catch (error) {
    console.log("Error on API logout", error);
    return error.response ? error.response.data : error;
  }
};
