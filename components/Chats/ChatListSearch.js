import React, { useEffect, useState } from 'react';
import axios from "axios";
import { List, Image, Search } from "semantic-ui-react";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import baseUrl from "../../utilities/baseUrl";

let cancel;

// already have "Search" import from semantic-ui
// component name avoids similarities in terms

function ChatListSearch({ chats, setChats }) {

    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);;

    const router = useRouter();

    const handleChange = async e => {
        const { value } = e.target;
        setText(value);
        if (value.length === 0) return;

        // removes white spaces during search
        if (value.trim().length === 0) return;

        setText(value);
        setLoading(true);

        try {
            cancel && cancel()
            const CancelToken = axios.CancelToken;
            // send token from local storage
            const token = cookie.get("token");

            const res = await axios.get(`${baseUrl}/api/search/${value}`, {
                headers: { Authorization: token },
                cancelToken: new CancelToken(canceler => {
                    cancel = canceler;
                })
            });

            // fixed bug where no results from the backend but 
            // the previous state was still populated and showing 
            // some results 
            if (res.data.length === 0) {
                results.length > 0 && setResults([]);
                return setLoading(false);
            }
            setResults(res.data);

        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    // add chat method checking if user already 
    // has a chat log with that person
    const addChat = result => {
        const alreadyInChat =
            chats.length > 0 &&
            chats.filter(chat => chat.messagesWith === result._id).length > 0;

        if (alreadyInChat) {
            return router.push(`/messages?message=${result._id}`);
        }
        // new chat with chat properties
        else {
            const newChat = {
                messagesWith: result._id,
                name: result.name,
                profilePicUrl: result.profilePicUrl,
                lastMessage: "",
                date: Date.now()
            };
            // pass in new chat and spread previous
            setChats(prev => [newChat, ...prev]);

            return router.push(`/messages?message=${result._id}`);
        }
    };


    // fixed bug when text length was equal to 0 and loading was 
    // not being changed to false automatically

    useEffect(() => {

        if (text.length === 0 && loading) setLoading(false);
    }, [text]);

    return (
        <Search onBlur={() => {
            results.length > 0 && setResults([]);
            loading && setLoading(false);
            setText("");
        }}
            loading={loading}
            value={text}
            resultRenderer={ResultRenderer}
            results={results}
            onSearchChange={handleChange}
            minCharacters={1}
            onResultSelect={(e, data) => {
                addChat(data.result)
            }}
        />
    );
}

const ResultRenderer = ({ _id, profilePicUrl, name }) => {
    return (
        <List key={_id}>
            <List.Item>
                <Image src={profilePicUrl} alt="ProfilePic" avatar />
                <List.Content header={name} as="a" />
            </List.Item>
        </List>
    );
};


export default ChatListSearch;

