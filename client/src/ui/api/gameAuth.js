import axios from "../utils/baseUrl";

export const login_user = async function (body) {
  try {
    // Pass the body directly instead of wrapping it inside another object
    const { data } = await axios.post("/api/auth/login", body);
    return data;
  } catch (error) {
    console.log("Error on API", error);
    return error;
  }
};

export const logout_user = async function () {
  try {
    // Pass the body directly instead of wrapping it inside another object
    const { data } = await axios.post("/api/auth/logout");
    return data;
  } catch (error) {
    console.log("Error on API", error);
    return error;
  }
};
