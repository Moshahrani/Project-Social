import React, { useEffect, useState, useRef } from "react";
import axios from "axios"
import io from "socket.io-client";
import baseUrl from "../utilities/baseUrl";
import CreatePost from "../components/Post/CreatePost";
import PostLayout from "../components/Post/PostLayout";
import { Placeholder, Segment } from "semantic-ui-react";
import { parseCookies } from "nookies";
import { NoPosts } from "../components/NoData";
import { PostDeleteToast } from "../components/Toast";
import userInfo from "../utilities/userInfo";
import InfiniteScroll from "react-infinite-scroll-component";
import { PlaceHolderPosts, EndMessage } from "../components/PlaceHolderGroup";
import MessageNotificationModal from "../components/MessageNotificationModal";
import NotifyProp from "../components/NotifyProp";
import newMsgSound from "../utilities/newMessageAlert";
import cookie from "js-cookie";

function Index({ user, postsData, errorLoading }) {

  const [posts, setPosts] = useState(postsData);
  const [showToast, setShowToast] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [newMessageModal, showNewMessageModal] = useState(false);

  const [newNotification, setNewNotification] = useState(null);
  const [notificationPopup, showNotificationPopup] = useState(false);

  const [pageNumber, setPageNumber] = useState(2);

  const socket = useRef();


  useEffect(() => {

    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit("join", { userId: user._id });

      socket.current.on("newMsgReceived", async ({ newMsg }) => {

        // will give us the name and profilePicUrl 
        // which we'll need in the modal
        const { name, profilePicUrl } = await userInfo(newMsg.sender)

        if (user.newMessagePopup) {

          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePic: profilePicUrl
          });
          showNewMessageModal(true);
        }

        newMsgSound(name);
      });
    }

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

  useEffect(() => {

    if (socket.current) {
      socket.current.on("newNotificationReceived", ({ name, username, profilePicUrl, postId }) => {

        // all info from backend to use for setting state
        setNewNotification({ name, username, profilePicUrl, postId })

        showNotificationPopup(true)
      })
    }
  }, [])

  return (
    <>
      {notificationPopup && newNotification !== null && (
        <NotifyProp
          newNotification={newNotification}
          notificationPopup={notificationPopup}
          showNotificationPopup={showNotificationPopup}
        />)}

      {showToast && <PostDeleteToast />}
      {/* conditional for new message modal */}
      {newMessageModal && newMessageReceived !== null && (
        <MessageNotificationModal
          socket={socket}
          showNewMessageModal={showNewMessageModal}
          newMessageModal={newMessageModal}
          newMessageReceived={newMessageReceived}
          user={user}
        />
      )}
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
                  socket={socket}
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

export const getServerSideProps = async ctx => {

  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1 }
    });

    return { props: { postsData: res.data } };
    
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

export default Index;
