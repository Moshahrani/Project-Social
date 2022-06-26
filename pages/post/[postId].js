import { useState } from "react";
import { Card, Container, Divider, Icon, Image, Segment } from "semantic-ui-react";
import axios from "axios";
import Link from "next/link";
import { parseCookies } from "nookies";
import CommentField from "../../components/Post/CommentField";
import LikesList from "../../components/Post/LikesList";
import PostComments from "../../components/Post/PostComments";
import baseUrl from "../../utilities/baseUrl";
import { likePost } from "../../utilities/postEvents";
import calculateTime from "../../utilities/calculateTime";
import { NoPostFound } from "../../components/NoData";

function Post({ post, errorLoading, user }) {

    if (errorLoading) {
        return <NoPostFound />;
    }

    const [likes, setLikes] = useState(post.likes);

    const liked =
        likes.length > 0 && likes.filter(like => like.user === user._id).length > 0;

    const [comments, setComments] = useState(post.comments);

    // reusing code from postLayout.js for post layout properties 
    return (
        <Container text>
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
                            onClick={() => setShowModal(true)}
                        />
                    )}

                    <Card.Content>
                        <Image floated="left"
                            src={post.user.profilePicUrl}
                            avatar
                            circular />
                        {/* link when clicked will redirect user to their profile page */}
                        <Card.Header>
                            <Link href={`/${post.user.username}`}>
                                <a>{post.user.name}</a>
                            </Link>
                        </Card.Header>

                        <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

                        {post.location && <Card.Meta content={post.location} />}

                        <Card.Description
                            style={{
                                fontSize: "17px",
                                letterSpacing: "0.1px",
                                wordSpacing: "0.35px"
                            }}
                        >
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
                            comments.map(comment => (
                                <PostComments
                                    key={comment._id}
                                    comment={comment}
                                    postId={post._id}
                                    user={user}
                                    setComments={setComments}
                                />
                            ))}

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
        </Container>
    );
};

Post.getInitialProps = async (ctx) => {

    try {

        const { postId } = ctx.query;
        const { token } = parseCookies(ctx);

        const result = await axios.get(`${baseUrl}/api/posts/${postId}`, {
            headers: { Authorization: token }
        });

        return { post: result.data };
    } catch (error) {
        return { errorLoading: true };
    }
};

export default Post;