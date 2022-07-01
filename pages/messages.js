import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
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
import newMsgSound from "../utilities/newMessageAlert";
import cookie from "js-cookie";

// new message should scroll chat to bottom to see latest message
const scrollDivDown = divRef => {
    // smooth behavior transition animation for scrolling to bottom
    divRef.current !== null && divRef.current.scrollIntoView({ behavior: "smooth" })
}

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

    const divRef = useRef();


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
                // scroll div to bottom 
                divRef.current && scrollDivDown(divRef);
            })

            socket.current.on("noChatFound", async () => {

                const { name, profilePicUrl } = await userInfo(router.query.message)

                setBannerData({ name, profilePicUrl });
                setMessages([]);

                // set value to query.message because we don't receive 
                // any chat from backend, value will be saved throughout re-renders
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

    // useEffect for sending and receiving new messages 
    useEffect(() => {
        if (socket.current) {
            socket.current.on("msgSent", ({ newMsg }) => {

                // making sure we send message update to chat 
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

            socket.current.on("newMsgReceived", async ({ newMsg }) => {

                let senderName = "";

                // sending message to user while chat is currently opened for view
                if (newMsg.sender === openChatId.current) {

                    setMessages(prev => [...prev, newMsg])

                    setChats(prev => {
                        const prevChat = prev.find(chat => chat.messagesWith === newMsg.sender)
                        prevChat.lastMessage = newMsg.msg;
                        prevChat.date = newMsg.date;
                        senderName = prevChat.name;

                        return [...prev]
                    })
                }
                // if no previous chat with user
                else {

                    const { name, profilePicUrl } = await getUserInfo(newMsg.sender);

                    senderName = name;

                    const newChat = {
                        messagesWith: newMsg.sender,
                        name,
                        profilePicUrl,
                        lastMessage: newMsg.msg,
                        date: newMsg.date
                    };
                    // add new chat to top of list, spread previous array
                    setChats(prev => [newChat, ...prev]);
                }
                newMsgSound(senderName);
            })
        }
    }, []);

    // when messages state changes, execute scroll to bottom 
    useEffect(() => {
        messages.length > 0 && scrollDivDown(divRef);
    }, [messages]);

    // delete message by using socket  
    const deleteMsg = (messageId) => {

        if (socket.current) {
            socket.current.emit("deleteMsg", {
                userId: user._id,
                messagesWith: openChatId.current,
                messageId
            });
            // set messages  , 
            // filter previous messages 
            socket.current.on("msgDeleted", () => {
                setMessages(prev => prev.filter(message => message._id !== messageId))
            });

        }
    }

    // delete whole chat with other user
    const deleteChat = async messagesWith => {

        try {
            // using axios instead of socket
            await axios.delete(`${baseUrl}/api/chats/${messagesWith}`, {
                headers: { Authorization: cookie.get("token") }
            });
            // filter chats array and remove chat after deleting from backend

            setChats(prev => prev.filter(chat => chat.messagesWith !== messagesWith));

            // push user to messages route
            router.push("/messages", undefined, { shallow: true });

            // set openChat to empty strings in case user wants to create 
            // a new chat with same end user
            openChatId.current = "";

        } catch (error) {
            alert("Error deleting chat");
        }
    };


    return (
        <Segment basic padded size="large" style={{ marginTop: "5px" }}>
            <a href="/">
                <Header icon="home" content="Go Back!" style={{ cursor: "pointer" }} />
            </a>
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
                                            deleteChat={deleteChat}
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
                                                        divRef={divRef}
                                                        bannerProfilePic={bannerData.profilePicUrl}
                                                        key={i}
                                                        message={message}
                                                        user={user}
                                                        deleteMsg={deleteMsg}
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