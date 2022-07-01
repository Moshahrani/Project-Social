import React, { useState } from "react";
import { Icon, Popup } from "semantic-ui-react";
import calculateTime from "../../utilities/calculateTime";

function Message({
    message,
    user,
    deleteMsg,
    bannerProfilePic,
    divRef
}) {
    // state for showing delete icon for user's own messages 
    const [deleteIcon, showDeleteIcon] = useState(false)

    // boolean to check if I am the sender of message
    const imSender = message.sender === user._id;

    return (<div className="bubbleWrapper" ref={divRef}>

        <div
            className={imSender ? "inlineContainer own" : "inlineContainer"}
            onClick={() => imSender && showDeleteIcon(!deleteIcon)}
        >
            {/* conditional render of profile pic if user or end receiver */}
            <img
                className="inlineIcon"
                src={imSender ? user.profilePicUrl : bannerProfilePic}
            />

            <div className={imSender ? "ownBubble own" : "otherBubble other"}>
                {message.msg}
            </div>
            {/* delete functionality for each message of user's own messages */}
            {deleteIcon && (
                <Popup
                    trigger={
                        <Icon
                            name="trash"
                            color="red"
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteMsg(message._id)}
                        />
                    }
                    content="This will only delete the message from your inbox!"
                    position="top right"
                />
            )}
        </div>
        {/* check for time of message and time stamp each user's message */}
        <span className={imSender ? "own" : "other"}>{calculateTime(message.date)}</span>
    </div>
    );
}

export default Message;