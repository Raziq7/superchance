import axios from "axios";

export const login_user = async function (body) {
  try {
    // const { data } = await axios.post("api/v1/user/login/", {
    //   ...body,
    // });
    const {data} = await axios({
      method: "post",
      url: "api/v1/user/login/",
      data: body,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.log("error on  API", error);
    return error;
  }
};
