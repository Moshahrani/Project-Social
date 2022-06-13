import React, { useEffect, useState } from "react";
import axios from "axios"
import baseUrl from "../utilities/baseUrl";
import CreatePost from "../components/Post/CreatePost";
import PostLayout from "../components/Post/PostLayout";
import { Placeholder, Segment } from "semantic-ui-react";
import { parseCookies } from "nookies";
import { NoPosts } from "../components/NoData";
import { PostDeleteToast } from "../components/Toast";
import { Axios } from "../utilities/postEvents";
import InfiniteScroll from "react-infinite-scroll-component";
import { PlaceHolderPosts, EndMessage } from "../components/PlaceHolderGroup";
import cookie from "js-cookie";

function Index({ user, postsData, errorLoading }) {

  const [posts, setPosts] = useState(postsData);
  const [showToast, setShowToast] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [pageNumber, setPageNumber] = useState(2);

  useEffect(() => {
    document.title = `Welcome, ${user.name.split(" ")[0]}`;
  }, []);

  // when showToast changes to true
  // show 
  useEffect(() => {
    showToast && setTimeout(() => setShowToast(false), 3000);
  }, [showToast]);


  const fetchDataOnScroll = async () => {

    try {
       
      // send page number in get request using "params"
      const result = await axios.get(`${baseUrl}/api/posts`, {
        headers: { Authorization: cookie.get("token") }, 
        params: { pageNumber }
      });
      
      // if no more posts on the backend
      // setHasMore will tell infinite scroll component 
      // theres no more data to fetch, won't call function

      if (result.data.length === 0) {
        setHasMore(false);
      }
      // if there's data, spread previous and result.data
      setPosts(prev => [...prev, ...result.data]);
      setPageNumber(prev => prev + 1);

    } catch (error) {
      alert("Error fething Posts")
    }
  };

  return (
    <>
      {showToast && <PostDeleteToast />}
      <Segment>
        <CreatePost user={user} setPosts={setPosts} />

        {/* // hasMore implies if there's more data to fetch from the backend */}
        <InfiniteScroll
          hasMore={hasMore}
          next={fetchDataOnScroll}
          loader={<PlaceHolderPosts />}
          endMessage={<EndMessage />}
          dataLength={posts.length} >
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
              ))}
          </>
          }
        </InfiniteScroll>
      </Segment>
    </>
  )
};


Index.getInitialProps = async (ctx) => {

  try {

    const { token } = parseCookies(ctx)

    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1 }
    });
    return { postsData: res.data };

  } catch (error) {
    return { errorLoading: true }
  }
}

export default Index;
