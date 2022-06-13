import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Divider,
    Header,
    Icon,
    Image,
    Modal,
    Popup,
    Segment
} from "semantic-ui-react";
import PostComments from "./PostComments";
import CommentField from "./CommentField";
import Link from "next/link";
import calculateTime from "../../utilities/calculateTime";
import { deletePost, likePost } from "../../utilities/postEvents";
import LikesList from "./LikesList";

function PostLayout({ post, user, setPosts, setShowToast }) {

    const [likes, setLikes] = useState(post.likes);

    // checking if likes exist and filtering to check if user exists with likes array

    const liked = likes.length > 0 &&
        likes.filter(like => like.user === user._id).length > 0;

    const [comments, setComments] = useState(post.comments);
    const [error, setError] = useState(null);

    return (
        <>
            <Segment basic>
                <Card color="teal" fluid>
                    {post.picUrl && (
                        <Image
                            src={post.picUrl}
                            style={{ cursor: "pointer" }}
                            floated="left"
                            wrapped
                            ui={false}
                            alt="PostImage"
                        />
                    )}

                    <Card.Content>
                        <Image floated="left"
                            src={post.user.profilePicUrl}
                            avatar
                            circular />
                        {/* checking if user who created 
                         the post is same as user that is logged in  */}
                        {(user.role === "root" || post.user._id === user._id) && (
                            <>
                                <Popup on="click"
                                    position="top right"
                                    trigger={<Image src="/trashCan.png"
                                        style={{ cursor: "pointer" }}
                                        size="mini"
                                        floated="right"
                                    />}>

                                    <Header as="h4" content="Are you sure?" />
                                    <p>This action is irreversible!</p>

                                    <Button
                                        color="red"
                                        icon="trash"
                                        content="Delete"
                                        onClick={() => deletePost(post._id, setPosts, setShowToast)} />
                                </Popup>
                            </>
                        )}

                        {/* link when clicked will redirect user to their profile page */}
                        <Card.Header>
                            <Link href={`/${post.user.username}`}>
                                <a>{post.user.name}</a>
                            </Link>
                        </Card.Header>

                        {/* will display time of post creation */}
                        <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>
                        {post.location && <Card.Meta content={post.location} />}

                        <Card.Description style={{
                            fontSize: "16px",
                            letterSpacing: "0.1px",
                            wordSpacing: "0.35px"
                        }}>
                            {post.text}
                        </Card.Description>
                    </Card.Content>

                    {/* showing heart style based on if liked or not */}
                    <Card.Content extra>
                        <Icon
                            name={liked ? "heart" : "heart outline"}
                            color="red"
                            style={{ cursor: "pointer" }}
                            // passing onClick method with 4th paramater being a 
                            // conditional if user has already liked the post or not
                            onClick={() => likePost(post._id, user._id, setLikes, liked ? false : true)}
                        />
                        <LikesList
                            postId={post._id}
                            trigger={
                                /* conditional rendering of single like or multiple likes  */
                                likes.length > 0 && (
                                    <span className="spanLikesList">
                                        {`${likes.length} ${likes.length === 1 ? "like" : "likes"}`}
                                    </span>
                                )
                            }
                        />
                        <Icon
                            name="comment outline"
                            style={{ marginLeft: "7px" }}
                            color="blue"
                        />

                        {comments.length > 0 &&
                            comments.map((comment, i) =>
                                i < 3 && (
                                    <PostComments
                                        key={comment._id}
                                        comment={comment}
                                        postId={post._id}
                                        user={user}
                                        setComments={setComments}
                                    />
                                )
                            )}

                        {comments.length > 3 &&
                            <Button
                                content="View More"
                                color="teal"
                                basic circular />}

                        <Divider hidden />

                        <CommentField
                            user={user}
                            postId={post._id}
                            setComments={setComments}
                        />
                    </Card.Content>
                </Card>
            </Segment>
            <Divider hidden />
        </>
    );
};

export default PostLayout;