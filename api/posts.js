const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const PostModel = require("../models/PostModel");
const uuid = require("uuid").v4;

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

    try {
        // sorting posts in descending order of date creation
        const posts = await PostModel.find()
            .sort({ createdAt: -1 })
            .populate("user")
            .populate("comments.user");

        return res.json(posts);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
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

            const postByUserId = post.user.toString();

            if (postByUserId !== userId) {
                await removeCommentNotification(postId, commentId, userId, postByUserId);
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
