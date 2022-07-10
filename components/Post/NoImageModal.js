import React from 'react'
import { Card, Divider, Icon, Image, Modal } from "semantic-ui-react";
import PostComments from "./PostComments";
import CommentField from "./CommentField";
import Link from "next/link";
import calculateTime from "../../utilities/calculateTime";
import { deletePost, likePost } from "../../utilities/postEvents";
import LikesList from "./LikesList";

function NoImageModal({
    post,
    user,
    setLikes,
    likes,
    liked,
    comments,
    setComments
}) {

    return (
        <Card fluid>
            <Card.Content>
                <Image avatar floated="left" src={post.user.profilePicUrl} />
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

                <Divider hidden />

                <div style={{
                    marginBottom: "8px",
                    height: comments.length > 2 ? "200px" : "60px",
                    overflow: "auto"
                }}>
                    {comments.length > 0 &&
                        comments.map((comment, i) => (
                            <PostComments
                                key={comment._id}
                                comment={comment}
                                postId={post._id}
                                user={user}
                                setComments={setComments}
                            />
                        )
                        )}

                </div>
                <CommentField
                    postId={post._id}
                    user={user}
                    setComments={setComments}
                />
            </Card.Content>
        </Card>
    )
}

export default NoImageModal