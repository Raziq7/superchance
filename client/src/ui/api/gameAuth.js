import axios from "../utils/baseUrl";

export const login_user = async function (body) {
  try {
    // Pass the body directly instead of wrapping it inside another object
    const { data } = await axios.post("/api/user/login/", body);
    return data;
  } catch (error) {
    console.log("Error on API", error);
    return error;
  }
};
