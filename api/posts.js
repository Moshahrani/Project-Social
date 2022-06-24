const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const PostModel = require("../models/PostModel");
const uuid = require("uuid").v4;
const { 
    newLikeNotification, 
    removeLikeNotification, 
    newCommentNotification, 
    removeCommentNotification 
} = require("../utilities/notificationEvents");

// creating a post

router.post("/", authMiddleware, async (req, res) => {
    const { text, location, picUrl } = req.body;

    if (text.length < 1) {
        return res.status(401).send("Must contain at least 1 character");
    }

    try {

        const newPost = {
            user: req.userId,
            text
        }

        if (location) newPost.location = location;
        if (picUrl) newPost.picUrl = picUrl;

        const post = await new PostModel(newPost).save();

        const postCreated = await PostModel.findById(post._id).populate("user");

        return res.json(postCreated);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

// get all posts 

router.get("/", authMiddleware, async (req, res) => {

    const { pageNumber } = req.query;

    const number = Number(pageNumber);
    // default size
    const size = 8;

    // new portion

    const { userId } = req;

    try {
        const number = Number(pageNumber);
        const size = 8;
        const { userId } = req;

        // return back following only 
        // to see only following user's posts in feed (not followers)
        const loggedUser = await FollowerModel.findOne({ user: userId }).select(
            "-followers"
        );

        let posts = [];
        // if page 1 (pagination in frontend)
        if (number === 1) {
            // if logged in user is following at least one user 
            if (loggedUser.following.length > 0) {
                posts = await PostModel.find({
                    user: {    // mapping all users the user is following and spreading to 
                        // mongo db "in" operator all users and their posts
                        $in: [userId, ...loggedUser.following.map(following => following.user)]
                    }
                })
                    .limit(size)
                    .sort({ createdAt: -1 })
                    .populate("user")
                    .populate("comments.user");
            }
            // if user is not following anyone, and still page 1
            // return user's own posts
            else {
                posts = await PostModel.find({ user: userId })
                    .limit(size)
                    .sort({ createdAt: -1 })
                    .populate("user")
                    .populate("comments.user");
            }
        }

        // if page number is greater than 1
        else {
            // skip variable to skip over the posts we 
            // have already sent 
            const skips = size * (number - 1);

            if (loggedUser.following.length > 0) {
                posts = await PostModel.find({
                    user: {
                        $in: [userId, ...loggedUser.following.map(following => following.user)]
                    }
                })
                    .skip(skips)
                    .limit(size)
                    .sort({ createdAt: -1 })
                    .populate("user")
                    .populate("comments.user");
            }
            // if greater than page 1 && user is following no one
            else {
                posts = await PostModel.find({ user: userId })
                    .skip(skips)
                    .limit(size)
                    .sort({ createdAt: -1 })
                    .populate("user")
                    .populate("comments.user");
            }
        }

        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Server error`);
    }
});




// get post by ID

router.get("/:postId", authMiddleware, async (req, res) => {

    try {

        const post = await PostModel.findById(req.params.postId)
            .populate("user")
            .populate("comments.user");

        if (!post) {
            return res.status(404).send("Post not found");
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
})

// delete post by ID

router.delete("/:postId", authMiddleware, async (req, res) => {

    try {

        const { userId } = req;

        const { postId } = req.params;

        const post = await PostModel.findById(postId)

        if (!post) {
            return res.status(404).send("post not found");
        }

        const user = await UserModel.findById(userId);

        // post.user is an object in post Schema Model so convert to string
        // check if post is authored by current user

        if (post.user.toString() !== userId) {

            // user can only delete posts if root user
            if (user.role === "root") {
                await post.remove()
                return res.status(200).send("Post deleted successfully");
            } else {
                return res.status(401).send("Unauthorized");
            }
        }
        // proceed to delete post

        await post.remove()
        return res.status(200).send("Post deleted successfully");

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
})

// like a post

router.post("/like/:postId", authMiddleware, async (req, res) => {

    try {

        const { postId } = req.params;
        const { userId } = req;

        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).send("No Post Found");
        }

        // check if post has already been liked before 
        const liked = post.likes.filter(like =>
            like.user.toString() === userId).length > 0;

        if (liked) {
            return res.status(401).send("Post already liked");
        }

        await post.likes.unshift({ user: userId });
        await post.save();
        
        // if user is liking their own post, no notification 
        // will be sent to them
        if (post.user.toString() !== userId) {
            await newLikeNotification(userId, postId, post.user.toString());
        }

        return res.status(200).send("Liked the Post")
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
})

// unlike a post

router.put("/unlike/:postId", authMiddleware, async (req, res) => {

    try {

        const { postId } = req.params;
        const { userId } = req;

        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).send("No Post Found");
        }
        // filtering over likes array and checking 
        // if post has not been liked before
        const liked = post.likes.filter(like =>
            like.user.toString() === userId).length === 0;

        if (liked) {
            return res.status(401).send("Post never liked previously");
        }

        // mapping over likes to find index of post
        const index = post.likes.map(like => like.user.toString()).indexOf(userId);

        // removing object from likes array
        await post.likes.splice(index, 1);

        await post.save();

        // if user is unliking their own post, no notification 
        // will be sent to them
        if (post.user.toString() !== userId) {
             await removeLikeNotification(userId, postId, post.user.toString());
        }

        return res.status(200).send("Post Unliked")
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
})

// get all likes of a post

router.get("/like/:postId", authMiddleware, async (req, res) => {

    try {

        const { postId } = req.params;

        const post = await PostModel.findById(postId).populate("likes.user");

        if (!post) {
            return res.status(404).send("No post found");
        }

        return res.status(200).json(post.likes);

    } catch (error) {
        console.error(error);
        return res.status(500).send("")
    }
})

// create a comment 

router.post("/comment/:postId", authMiddleware, async (req, res) => {

    try {

        const { postId } = req.params;

        const { userId } = req

        const { text } = req.body;

        if (text.length < 1) {
            return res.status(401).send("Comment should be at least one character");
        }

        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).send("Post not found")
        }
        // using the uuid dependency to create a
        // unique identifier for each new comment
        const newComment = {
            _id: uuid(),
            text,
            user: userId,
            date: Date.now()
        };

        // add comment to start of array of comments of given post 
        await post.comments.unshift(newComment);
        await post.save();

        if (post.user.toString() !== userId) {
            await newCommentNotification(
                postId, 
                newComment._id, 
                userId, 
                post.user.toString(), 
                text
                )
        }

        return res.status(200).json(newComment._id);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

// delete a comment 

router.delete("/:postId/:commentId", authMiddleware, async (req, res) => {

    try {

        const { postId, commentId } = req.params;

        const { userId } = req;

        const post = await PostModel.findById(postId);

        // if no post exists
        if (!post) return res.status(404).send("Post not found");

        // return found comment for deletion 

        const comment = post.comments.find(comment => comment._id === commentId);

        if (!comment) {
            return res.status(404).send("No Comment found");
        }

        const user = await UserModel.findById(userId);

        // helper function for deleting comment to help avoid repeating code
        const deleteComment = async () => {
            const indexOf = post.comments.map(comment => comment._id).indexOf(commentId);

            await post.comments.splice(indexOf, 1);

            await post.save();

            

            if (post.user.toString() !== userId) {
                await removeCommentNotification(postId, commentId, userId, post.user.toString());
            }

            return res.status(200).send("Successfully deleted comment");
        };

        if (comment.user.toString() !== userId) {
            if (user.role === "root") {
                await deleteComment();
            } else {
                return res.status(401).send("Unauthorized");
            }
        }
        // if user is author of comment 
        await deleteComment();

    } catch (error) {
        console.error(error);
        return res.status(500).send(`Server error`);
    }
});




module.exports = router;
