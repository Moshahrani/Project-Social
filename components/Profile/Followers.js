import React, { useState, useEffect } from "react";
import { Button, Image, List } from "semantic-ui-react";
import { NoFollowData } from "../NoData";
import Spinner from "../Spinner";
import axios from "axios";
import baseUrl from "../../utilities/baseUrl";
import cookie from "js-cookie";
import { followUser, unfollowUser } from "../../utilities/profileEvents";

function Followers({
    user,
    loggedUserFollowStats,
    setUserFollowStats,
    profileUserId
}) {

    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    // get followers from backend 
    useEffect(() => {
        const getFollowers = async () => {
            setLoading(true);

            try {
                const res = await axios.get(
                    `${baseUrl}/api/profile/followers/${profileUserId}`,
                    {
                        headers: { Authorization: cookie.get("token") }
                    }
                );

                setFollowers(res.data);
            } catch (error) {
                alert("Error Loading Followers");
            }
            setLoading(false);
        };

        getFollowers();
    }, []);

    return (
        <>
            {loading ? (
                <Spinner />
            ) : followers.length > 0 ? (
                followers.map(profileFollower => {

                    const isFollowing =
                        loggedUserFollowStats.following.length > 0 &&
                        loggedUserFollowStats.following.filter(
                            following => following.user === profileFollower.user._id
                        ).length > 0;

                    return (
                        <List key={profileFollower.user._id} divided verticalAlign="middle">
                            <List.Item>
                                <List.Content floated="right">
                                    {profileFollower.user._id !== user._id && (
                                        <Button
                                            color={isFollowing ? "instagram" : "twitter"}
                                            icon={isFollowing ? "check" : "add user"}
                                            content={isFollowing ? "Following" : "Follow"}
                                            // if state changes to follow or unfollow user
                                            disabled={followLoading}
                                            onClick={async () => {
                                                setFollowLoading(true);

                                                isFollowing
                                                    ? await unfollowUser(profileFollower.user._id, setUserFollowStats)
                                                    : await followUser(profileFollower.user._id, setUserFollowStats);

                                                setFollowLoading(false);
                                            }}
                                        />
                                    )}
                                </List.Content>
                                <Image avatar src={profileFollower.user.profilePicUrl} />
                                <List.Content as="a" href={`/${profileFollower.user.username}`}>
                                    {profileFollower.user.name}
                                </List.Content>
                            </List.Item>
                        </List>
                    );
                })
            ) : (
                // shows if no follower data available
                <NoFollowData followersComponent={true} />
            )}
        </>
    );
};

export default Followers;