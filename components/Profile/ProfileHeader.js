import React, { useState } from 'react';
import {
    Button,
    Grid,
    Divider,
    Header,
    Image,
    List,
    Segment
} from "semantic-ui-react";


function ProfileHeader({
    profile,
    ownAccount,
    loggedUserFollowStats,
    setUserFollowStats
}) {

    // state for loading 
    const [loading, setLoading] = useState(false)

    // boolean to check if already following user 
    // whose profile we are looking at 
    const isFollowing = loggedUserFollowStats.following.length > 0 &&
        loggedUserFollowStats.following.filter(
            following => following.user === profile.user._id
        ).length > 0;

    return (
        <>
            <Segment>
                <Grid stackable>
                    <Grid.Column width={11}>
                        <Grid.Row>
                            <Header
                                as="h2"
                                content={profile.user.name}
                                style={{ marginBottom: "5px" }}
                            />
                        </Grid.Row>
                        {/* // render bio here  */}
                        <Grid.Row stretched>
                            {profile.bio}
                            <Divider hidden />
                        </Grid.Row>

                        {/* // links for social networks with icons  */}
                        <Grid.Row>
                            {profile.social ? (
                                <List>
                                    <List.Item>
                                        <List.Icon name="mail" />
                                        <List.Content content={profile.user.email} />
                                    </List.Item>
                                    {/* // facebook */}
                                    {profile.social.facebook && (
                                        <List.Item>
                                            <List.Icon name="facebook" color="blue" />
                                            <List.Content
                                                style={{ color: "blue" }}
                                                content={profile.social.facebook}
                                            />
                                        </List.Item>
                                    )}
                                    {/* // instagram  */}
                                    {profile.social.instagram && (
                                        <List.Item>
                                            <List.Icon name="instagram" color="red" />
                                            <List.Content
                                                style={{ color: "blue" }}
                                                content={profile.social.instagram}
                                            />
                                        </List.Item>
                                    )}
                                    {/* // twitter  */}
                                    {profile.social.twitter && (
                                        <List.Item>
                                            <List.Icon name="twitter" color="blue" />
                                            <List.Content
                                                style={{ color: "blue" }}
                                                content={profile.social.twitter}
                                            />
                                        </List.Item>
                                    )}
                                    {/* // youtube */}
                                    {profile.social.youtube && (
                                        <List.Item>
                                            <List.Icon name="youtube" color="red" />
                                            <List.Content
                                                style={{ color: "blue" }}
                                                content={profile.social.youtube}
                                            />
                                        </List.Item>
                                    )}

                                </List>
                            ) : (
                                <> No Social Media Links available</>
                            )}
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={5} stretched style={{ textAlign: "center" }}>
                        <Grid.Row>
                            <Image size="large" avatar src={profile.user.profilePicUrl} />
                        </Grid.Row>
                        <br />
                        
                        {/* // will show follow info based on followstats and while not on own profile */}

                        {!ownAccount && (
                            <Button
                                compact
                                loading={loading}
                                disabled={loading}
                                content={isFollowing ? "Following" : "Follow"}
                                icon={isFollowing ? "check circle" : "add user"}
                                color={isFollowing ? "instagram" : "twitter"}
                            />
                        )}
                    </Grid.Column>
                </Grid>
            </Segment>
        </>
    );
}

export default ProfileHeader;
