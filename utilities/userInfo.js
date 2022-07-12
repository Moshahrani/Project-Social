import axios from "axios";
import baseUrl from "./baseUrl";
import cookie from "js-cookie";

const userInfo = async (userToFindId) => {

  try {

    const result = await axios.get(`${baseUrl}/api/chats/user/${userToFindId}`, {
      headers: { Authorization: cookie.get("token") }
    });

    return { name: result.data.name, profilePicUrl: result.data.profilePicUrl };

  } catch (error) {
    console.error(error);
  }
};

export default userInfo;