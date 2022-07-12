import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";

// axios instance helps avoid passsing headers for 
// every request

export const Axios = axios.create({
  baseURL: `${baseUrl}/api/posts`,
  headers: { Authorization: cookie.get("token") }
});

// new post submit request 

export const submitNewPost = async (
  text,
  location,
  picUrl,
  setPosts,
  setNewPost,
  setError
) => {

  try {

    const res = await Axios.post("/", { text, location, picUrl });

    // adding new post to the top of the array for first render
    // getting post from backend now

    setPosts(prev => [res.data, ...prev]);

    setNewPost({ text: "", location: "" });

  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
};

// new delete post request 

export const deletePost = async (postId, setPosts, setShowToast) => {

  try {

    await Axios.delete(`/${postId}`);

    setPosts(prev => prev.filter(post => post._id !== postId));
    setShowToast(true);

  } catch (error) {
    alert(catchErrors(error));
  }
};

// like / unlike a post 

export const likePost = async (postId, userId, setLikes, like = true) => {

  try {
    // if like, update like on post 
    if (like) {

      await Axios.post(`/like/${postId}`);

      setLikes(prev => [...prev, { user: userId }]);
    }

    // will filter out likes array and remove like
    // of user currently logged in

    else if (!like) {
      await Axios.put(`/unlike/${postId}`)

      setLikes(prev => prev.filter(like => like.user !== userId));
    }

  } catch (error) {
    alert(catchErrors(error))
  }
};

// post a comment 

export const postComment = async (postId, user, text, setComments, setText) => {

  try {

    const result = await Axios.post(`/comment/${postId}`, { text });

    const newComment = {
      _id: result.data,
      user,
      text,
      date: Date.now()
    };

    setComments(prev => [newComment, ...prev]);
    setText("");

  } catch (error) {
    alert(catchErrors(error))
  }
};

// delete a comment

export const deleteComment = async (postId, commentId, setComments) => {

  try {

    await Axios.delete(`/${postId}/${commentId}`)
    setComments(prev => prev.filter(comment => comment._id !== commentId));

  } catch (error) {
    alert(catchErrors(error));
  }
}

