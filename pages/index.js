import React, { useEffect, useState } from "react";
import axios from "axios"
import baseUrl from "../utilities/baseUrl";
import CreatePost from "../components/Post/CreatePost";
import PostLayout from "../components/Post/PostLayout";
import { Segment } from "semantic-ui-react";
import { parseCookies } from "nookies";
import { NoPosts} from "../components/NoData";

function Index({ user, postsData, errorLoading }) {

  const [posts, setPosts] = useState(postsData);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.title = `Welcome, ${user.name.split(" ")[0]}`;
  }, []);

  if (posts.length === 0 || errorLoading) {
    // message notifying user that no post are available
    return <NoPosts />
  }

  return (
    <>
    <Segment>
      <CreatePost user={user} setPosts={setPosts} />

      {posts.map(post => {
        <CardPost
          key={post._id}
          post={post}
          user={user}
          setPosts={setPosts}
          setShowToast={setShowToast}
        />
      })}
      </Segment>
    </>
  )
}

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
