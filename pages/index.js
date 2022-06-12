import React, { useEffect, useState } from "react";
import axios from "axios"
import baseUrl from "../utilities/baseUrl";
import CreatePost from "../components/Post/CreatePost";
import PostLayout from "../components/Post/PostLayout";
import { Segment } from "semantic-ui-react";
import { parseCookies } from "nookies";
import { NoPosts } from "../components/NoData";
import { PostDeleteToast } from "../components/Toast";
import { Axios } from "../utilities/postEvents";

function Index({ user, postsData, errorLoading }) {

  const [posts, setPosts] = useState(postsData);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.title = `Welcome, ${user.name.split(" ")[0]}`;
  }, []);
   
  // when showToast changes to true
  // show 
  useEffect(() => {
    showToast && setTimeout(() => setShowToast(false), 3000);
  }, [showToast]);

  return (
    <>
      {showToast && <PostDeleteToast />}
      <Segment>
        <CreatePost user={user} setPosts={setPosts} />

        {/* // message notifying user that no post are available */}
        {posts.length === 0 || errorLoading ? (
          <NoPosts />
        ) : <>
          {
            posts.map(post => (
              <PostLayout
                key={post._id}
                post={post}
                user={user}
                setPosts={setPosts}
                setShowToast={setShowToast}
              />
            ))
          }
        </>
        }
      </Segment>
    </>
  )
};


Index.getInitialProps = async (ctx) => {

  try {

    const { token } = parseCookies(ctx)

    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token }
    });
    return { postsData: res.data };

  } catch (error) {
    return { errorLoading: true }
  }
}

export default Index;
