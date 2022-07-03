import { Feed, Icon, Segment, TransitionablePortal } from "semantic-ui-react";
import { useRouter } from "next/router";
import calculateTime from "../utilities/calculateTime";
import newMsgSound from "../utilities/newMessageAlert";

function NotifyProp({ newNotification, notificationPopup, showNotificationPopup }) {

    const router = useRouter();

    const { name, username, profilePicUrl, postId } = newNotification;

    return (

        // transitionable portal semantic prop, 
        // can add transition animations & duration
        // wrapping all of the content
        <TransitionablePortal
            transition={{ animation: "fade right", duration: "500" }}
            onClose={() => notificationPopup && showNotificationPopup(false)}
            onOpen={newMsgSound}
            open={notificationPopup}
        >
            {/* notification will be on top right of screen  */}
            <Segment style={{ right: "5%", position: "fixed", top: "10%", zIndex: 999 }}>
                <Icon
                    name="close"
                    size="large"
                    style={{ float: "right", cursor: "pointer" }}
                    // close icon with an x on the top right of the notification portal component
                    onClick={() => showNotificationPopup(false)}
                />
                {/* feed component will have profile pic, link to post, and timestamp of like
                    same as in the notifications component */}
                <Feed>
                    <Feed.Event>
                        <Feed.Label>
                            <img src={profilePicUrl} />
                        </Feed.Label>
                        <Feed.Content>
                            <Feed.Summary>
                                <Feed.User onClick={() => router.push(`/${username}`)}>{name} </Feed.User>{" "}
                                liked your <a onClick={() => router.push(`/post/${postId}`)}> post</a>
                                <Feed.Date>{calculateTime(Date.now())}</Feed.Date>
                            </Feed.Summary>
                        </Feed.Content>
                    </Feed.Event>
                </Feed>
            </Segment>
        </TransitionablePortal>
    );
}

export default NotifyProp;