import React from "react";
import axios from "axios";
import baseUrl from "../utilities/baseUrl";
import { parseCookies } from "nookies";

function Messages({ chatsData }) {
    
    const [chats,setChats] = useState(chatsData)

    
    return (
        <div>

        </div>
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