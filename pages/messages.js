import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useRouter } from "next/router";
import baseUrl from "../utilities/baseUrl";
import { parseCookies } from "nookies";
import { Comment, Divider, Grid, Header, Icon, Segment } from "semantic-ui-react";
import Chat from "../components/Chats/Chat";
import ChatListSearch from "../components/Chats/ChatListSearch";
import { NoMessages } from "../components/NoData";
import Message from "../components/Chats/Message";
import MessageField from "../components/Chats/MessageField";
import Banner from "../components/Chats/Banner";
import userInfo from "../utilities/userInfo";

function Messages({ chatsData, user }) {

    const router = useRouter();
    const socket = useRef();

    const [chats, setChats] = useState(chatsData || [])

    // use this to check if user is online or not
    const [connectedUsers, setConnectedUsers] = useState([]);

    const [messages, setMessages] = useState([]);

    // state for name of user & profile pic  
    // where it shows on the chat/message feature
    const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" })

    // ref is for updating state of url query string during re-renders.
    // it is also the querystring inside the url 
    const openChatId = useRef("")

    // useEffect for connection
    useEffect(() => {

        // ref has current property
        // connecting with server by calling "io"
        if (!socket.current) {
            socket.current = io(baseUrl)
        }

        if (socket.current) {

            socket.current.emit("join", { userId: user._id })
            // listening to event, sending users
            socket.current.on("connectedUsers", ({ users }) => {
                users.length > 0 && setConnectedUsers(users);
            })
        }

        // if there's no query string inside URL, 
        // only then we'll push user to first chat
        if (chats.length > 0 && !router.query.message)
            router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
                shallow: true
            });
    }, []);

    // useEffect for loading the messages
    useEffect(() => {

        const loadMessages = () => {
            socket.current.emit("loadMessages", {
                userId: user._id,
                messagesWith: router.query.message
            });

            socket.current.on("messagesLoaded", ({ chat }) => {
                setMessages(chat.messages);
                setBannerData({
                    name: chat.messagesWith.name,
                    profilePicUrl: chat.messagesWith.profilePicUrl
                });

                // ref will keep track of query string during re-renders
                openChatId.current = chat.messagesWith._id;
            })

            socket.current.on("noChatFound", async () => {
                console.log(router.query)
                const { name, profilePicUrl } = await userInfo(router.query.message)

                setBannerData({ name, profilePicUrl });
                setMessages([]);

                openChatId.current = router.query.message;
            })
        };

        if (socket.current && router.query.message) {
            loadMessages();
        }
    }, [router.query.message])

    // send message method 
    const sendMsg = msg => {
        if (socket.current) {
            socket.current.emit("sendNewMsg", {
                userId: user._id,
                msgSendToUserId: openChatId.current,
                msg,
            })
        }
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msgSent", ({ newMsg }) => {
                // making sure we send message to chat we have open
                if (newMsg.receiver === openChatId.current) {
                    setMessages(prev => [...prev, newMsg]);

                    // send most recent message to ChatList 
                    setChats(prev => {
                        const previousChat = prev.find(
                            chat => chat.messagesWith === newMsg.receiver
                        );
                        previousChat.lastMessage = newMsg.msg;
                        previousChat.date = newMsg.date;

                        return [...prev];
                    });
                }
            });

        }
    }, []);




    return (
        <Segment basic padded size="large" style={{ marginTop: "5px" }}>
            <Header
                icon="home"
                content="Go Back!"
                onClick={() => router.push("/")}
                style={{ cursor: "pointer" }}
            />
            <Divider hidden />

            <div style={{ marginBottom: "10px" }}>
                <ChatListSearch chats={chats} setChats={setChats} />
            </div>

            {chats.length > 0 ? <>
                <>
                    <Grid stackable >
                        <Grid.Column width={4}>
                            <Comment.Group size="big">
                                <Segment raised style={{ overflow: "auto", maxHeight: "32rem" }}>
                                    {chats.map((chat, i) => (
                                        <Chat
                                            connectedUsers={connectedUsers}
                                            key={i}
                                            chat={chat}
                                            setChats={setChats}
                                        />
                                    ))}
                                </Segment>
                            </Comment.Group>
                        </Grid.Column>

                        <Grid.Column width={12}>
                            {router.query.message && (
                                <>
                                    <div
                                        style={{
                                            overflow: "auto",
                                            overflowX: "hidden",
                                            maxHeight: "35rem",
                                            height: "35rem",
                                            backgroundColor: "whitesmoke"
                                        }}
                                    >
                                        <div style={{ position: "sticky", top: "0" }}>
                                            <Banner bannerData={bannerData} />
                                        </div>
                                        {messages.length > 0 && (
                                            <>

                                                {messages.map((message, i) => (
                                                    <Message
                                                        bannerProfilePic={bannerData.profilePicUrl}
                                                        key={i}
                                                        message={message}
                                                        user={user}
                                                        setMessage={setMessages}
                                                        messagesWith={openChatId.current}
                                                    />
                                                ))}
                                            </>
                                        )}
                                    </div>
                                    <MessageField sendMsg={sendMsg} />
                                </>
                            )}
                        </Grid.Column>
                    </Grid></>



            </> : <NoMessages />}

        </Segment>
    )
}

Messages.getInitialProps = async (ctx) => {

    try {

        const { token } = parseCookies(ctx)

        const result = await axios.get(`${baseUrl}/api/chats`, {
            headers: { Authorization: token }
        })

        return { chatsData: result.data }

    } catch (error) {
        return { errorLoading: true }
    }
}

export default Messages;