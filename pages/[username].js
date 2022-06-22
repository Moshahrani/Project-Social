import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import baseUrl from "../utilities/baseUrl";
import cookie from "js-cookie";
import { parseCookies } from "nookies";
import { NoProfile, NoProfilePosts } from "../components/NoData";
import { Grid, Placeholder } from "semantic-ui-react";
import ProfileMenuTabs from "../components/Profile/ProfileMenuTabs";
import ProfileHeader from "../components/Profile/ProfileHeader";
import { PlaceHolderPosts } from "../components/PlaceHolderGroup";
import PostLayout from "../components/Post/PostLayout";
import { PostDeleteToast } from "../components/Toast";
import Followers from "../components/Profile/Followers";
import Following from "../components/Profile/Following";
import UpdateProfile from "../components/Profile/UpdateProfile";

function Profile({
    profile,
    followersLength,
    followingLength,
    errorLoading,
    user,
    userFollowInfo }) {

    const router = useRouter()

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    // to keep track of the active item tab chosen at top of profile page
    const [activeItem, setActiveItem] = useState("profile");
    // function to render out current active item
    const handleItemClick = item => setActiveItem(item);

    // user follow stats information
    const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowInfo);

    // animation for map
    const [showToast, setShowToast] = useState(false);

    // boolean if user is looking at their own account
    // will only show update profile and settings tabs 
    // if own account
    const ownAccount = profile?.user._id === user._id;

    // if no profile was found
    if (errorLoading) {
        return <NoProfile />;
    }

    useEffect(() => {

        const getPosts = async () => {

            setLoading(true)

            try {

                const { username } = router.query;
                const token = cookie.get("token");

                const res = await axios.get(`${baseUrl}/api/profile/posts/${username}`, {
                    headers: { Authorization: token }
                });
                // sending posts from backend
                setPosts(res.data);
            } catch (error) {
                alert("Error loading posts")
            }
            setLoading(false);
        };
        // call getPosts when component mounts 
        getPosts();
        // whenever username changes, render posts of that user
    }, [router.query.username]);

    // for toast animation 
    useEffect(() => {
        showToast && setTimeout(() => setShowToast(false), 4000);
    }, [showToast]);

    return <>

        {showToast && <PostDeleteToast />}
        <Grid stackable>
            <Grid.Row>
                <Grid.Column>
                    <ProfileMenuTabs
                        activeItem={activeItem}
                        handleItemClick={handleItemClick}
                        followersLength={followersLength}
                        followingLength={followingLength}
                        ownAccount={ownAccount}
                        loggedUserFollowStats={loggedUserFollowStats}
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    {activeItem === "profile" && (
                        <>
                            <ProfileHeader
                                profile={profile}
                                ownAccount={ownAccount}
                                loggedUserFollowStats={loggedUserFollowStats}
                                setUserFollowStats={setUserFollowStats}
                            />
                            {/* // if state is loading, show placeholder posts 
                           // and check if post length > 0, 
                           // only then we'll map over it  */}
                            {loading ? (
                                <PlaceHolderPosts />
                            ) : posts.length > 0 ? (
                                posts.map(post => (
                                    <PostLayout
                                        key={post._id}
                                        post={post}
                                        user={user}
                                        setPosts={setPosts}
                                        setShowToast={setShowToast}
                                    />
                                ))
                            ) : (
                                <NoProfilePosts />
                            )}
                        </>
                    )}
                    {/* // will render followers tab component when clicked  */}
                    {activeItem === "followers" && (
                        <Followers
                            user={user}
                            loggedUserFollowStats={loggedUserFollowStats}
                            setUserFollowStats={setUserFollowStats}
                            profileUserId={profile.user._id}
                        />
                    )}
                    {/* // will render following tab component when clicked  */}
                    {activeItem === "following" && (
                        <Following
                            user={user}
                            loggedUserFollowStats={loggedUserFollowStats}
                            setUserFollowStats={setUserFollowStats}
                            profileUserId={profile.user._id}
                        />
                    )}
                    {/* // update profile tab will render when active */}
                    {activeItem === "updateProfile" && <UpdateProfile Profile={profile} />}

                </Grid.Column>
            </Grid.Row>
        </Grid>
    </>
}

Profile.getInitialProps = async (ctx) => {

    try {

        const { username } = ctx.query;
        // helps server-side with cookies
        const { token } = parseCookies(ctx);

        const result = await axios.get(`${baseUrl}/api/profile/${username}`,
            { headers: { Authorization: token } })

        const { profile, followersLength, followingLength } = result.data

        return { profile, followersLength, followingLength }


    } catch (error) {
        return { errorLoading: true }
    }
}

export default Profile;


