import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";
import Router from "next/router";


export const Axios = axios.create({
  baseURL: `${baseUrl}/api/profile`,
  headers: { Authorization: cookie.get("token") }
});

// follow user request
export const followUser = async (userToFollowId, setUserFollowStats) => {

  try {

    await Axios.post(`/follow/${userToFollowId}`);

    //spread previous but add new followed user
    setUserFollowStats(prev => ({
      ...prev,
      following: [...prev.following, { user: userToFollowId }]
    }));
  } catch (error) {
    alert(catchErrors(error));
  }
};

export const unfollowUser = async (userToUnfollowId, setUserFollowStats) => {

  try {

    await Axios.put(`/unfollow/${userToUnfollowId}`);

    // spread previous but filter out unfollowed user
    setUserFollowStats(prev => ({
      ...prev,
      following: prev.following.filter(
        following => following.user !== userToUnfollowId
      )
    }));
  } catch (error) {
    alert(catchErrors(error));
  }
};

// profileUpdate function to update new information to backend
export const profileUpdate = async (profile, setLoading, setError, profilePicUrl) => {
  try {
    const { bio, facebook, instagram, youtube, twitter } = profile;

    await Axios.post(`/update`, {
      bio,
      facebook,
      instagram,
      youtube,
      twitter,
      profilePicUrl
    });

    setLoading(false);
    Router.reload();
  } catch (error) {
    setError(catchErrors(error));
    setLoading(false);
  }
};

// password update async func to backend
export const passwordUpdate = async (setSuccess, userPasswords) => {

  try {
    const { currentPassword, newPassword } = userPasswords;

    await Axios.post(`/settings/password`, { currentPassword, newPassword });

    setSuccess(true);
  } catch (error) {
    alert(catchErrors(error));
  }
};

// toggle message popup request from settings tab 
export const toggleMessagePopup = async (popupSetting, setPopupSetting, setSuccess) => {

  try {
    await Axios.post(`/settings/messagePopup`);

    setPopupSetting(!popupSetting);
    setSuccess(true);
  } catch (error) {
    alert(catchErrors(error));
  }
};
