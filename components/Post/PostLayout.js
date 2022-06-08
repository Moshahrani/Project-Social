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

function PostLayout({ post, user, setPosts, setShowToast }) {

    const [likes, setLIkes] = useState(post.likes);

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

                                    <Button color="red" icon="trash" content="Delete" />
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
                        />
                        {/* conditional rendering of single like or multiple likes  */}
                        {likes.length > 0 && (
                            <span className="spanLikesList">
                                {`${likes.length} ${likes.length === 1 ? "like" : "likes"}`}
                            </span>
                        )}
                        <Icon
                            name="comment outline"
                            style={{ marginLeft: "7px" }}
                            color="blue"
                        />

                        {comments.length > 0 &&
                            comments.map(comment => (
                                <PostComments
                                    key={comment._id}
                                    comment={comment}
                                    postId={post._id}
                                    user={user}
                                    setComments={setComments}
                                />
                            ))}

                        {comments.length &&
                            <Button
                                content="View More"
                                color="teal"
                                basic circular />}

                        <Divider hidden />

                        <CommentInputField
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