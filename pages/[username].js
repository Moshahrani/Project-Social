import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import baseUrl from "../utilities/baseUrl";
import cookie from "js-cookie";
import { parseCookies } from "nookies";
import { NoProfile } from "../components/NoData";
import { Grid } from "semantic-ui-react";
import ProfileMenuTabs from "../components/Profile/ProfileMenuTabs";

function Profile({
    profile,
    followersLength,
    followingLength,
    errorLoading,
    user,
    userFollowStats}) {

    const router = useRouter()

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    // to keep track of the active item tab chosen at top of profile page
    const [activeItem, setActiveItem] = useState("profile");
    // function to render out current active item
    const handleItemClick = item => setActiveItem(item);

    // user follow stats information
    const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);

    // boolean if user is looking at their own account
    // will only show update profile and settings tabs 
    // if own account
    console.log(profile);
    const ownAccount = profile.user._id === user._id;

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
    }, []);

    return <>
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


