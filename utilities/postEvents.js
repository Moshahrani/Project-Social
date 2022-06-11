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
    user,
    text,
    location,
    picUrl,
    setPosts,
    setNewPost,
    setError
  ) => {


    try {

      const res = await Axios.post("/", { text, location, picUrl });
      
    
      const newPost = {
        ...res.data,
        user,
        likes: [],
        comments: []
      };
      // adding new post to the top of the array for first render

      setPosts(prev => [newPost, ...prev]);
      
      setNewPost({ text: "", location: "" });

    } catch (error) {
      const errorMsg = catchErrors(error);
      setError(errorMsg);
    }
  };