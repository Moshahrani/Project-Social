import axios from "axios";
import baseUrl from "./baseUrl";
import catchError from "./catchErrors";
import cookie from "js-cookie";

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

export const profileUpdate = async (profile, setLoading, setError, profilePicUrl) => {
    try {
      const { bio, facebook, youtube, twitter, instagram } = profile;
 
      await Axios.post(`/update`, {
        bio,
        facebook,
        youtube,
        twitter,
        instagram,
        profilePicUrl
      });
 
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError(catchErrors(error));
      setLoading(false);
    }
  };