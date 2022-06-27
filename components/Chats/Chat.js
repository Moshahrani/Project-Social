import React from "react";
import { Comment, Divider, Icon, List } from "semantic-ui-react";
import { useRouter } from "next/router";
import calculateTime from "../../utilities/calculateTime";

function Chat({ chat, setChats }) {
  const router = useRouter();

  return (
    <>
     {/* changing the query name in the URL 
        based on the chat we choose, to the ID of the user */}
        
      <List selection>
        <List.Item
          active={router.query.message === chat.messagesWith}
          onClick={() =>
            router.push(`/messages?message=${chat.messagesWith}`, undefined, {
              shallow: true

              // ^^ shallow updates path of the current page without rerunning
            })
          }
        >
          <Comment>
            <Comment.Avatar src={chat.profilePicUrl} />
            <Comment.Content>
              <Comment.Author as="a">
                {chat.name}{" "}
                {isOnline && <Icon name="circle" size="small" color="green" />}
              </Comment.Author>

              <Comment.Metadata>
                <div>{calculateTime(chat.date)}</div>
                <div style={{ position: "absolute", right: "10px", cursor: "pointer" }}>
                  <Icon
                    name="trash alternate"
                    color="red"
                    onClick={() => deleteChat(chat.messagesWith)}
                  />
                </div>
              </Comment.Metadata>
               {/* if message is more than 20 characters, it will be cut off and a few periods 
               will be added at the end of the message preview area, to show message continuation */}
              <Comment.Text>
                {chat.lastMessage.length > 20
                  ? `${chat.lastMessage.substring(0, 20)} ...`
                  : chat.lastMessage}
              </Comment.Text>
            </Comment.Content>
          </Comment>
        </List.Item>
      </List>
      <Divider />
    </>
  );
}

export default Chat;
