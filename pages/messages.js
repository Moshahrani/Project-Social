import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import baseUrl from "../utilities/baseUrl";
import { parseCookies } from "nookies";
import { Comment, Divider, Grid, Header, Icon, Segment } from "semantic-ui-react";
import Chat from "../components/Chats/Chat";
import ChatListSearch from "../components/Chats/ChatListSearch";
import { NoMessages } from "../components/NoData";

function Messages({ chatsData, user }) {

    const [chats, setChats] = useState(chatsData)
    const router = useRouter();
    
    useEffect(() => {
        if (chats.length > 0)
          router.push(`/messages?message=${chats[0].messageWith}`, undefined, {
            shallow: true
          });
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
                <ChatListSearch user={user} chats={chats} setChats={setChats} />
            </div>

            {chats.length > 0 ? <>

                <>
                    <Grid stackable >
                        <Grid.Column width={4}>
                            <Comment.Group size="big">
                                <Segment raised style={{ overflow: "auto", maxHeight: "32rem" }}>
                                    {chats.map((chat, i) => (
                                        <Chat
                                            key={i}
                                            chat={chat}
                                            setChats={setChats}
                                        />
                                    ))}
                                </Segment>
                            </Comment.Group>
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