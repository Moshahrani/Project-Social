const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const PostModel = require("../models/PostModel");

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
        return res.json(post);

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
        // check if post is of current user

        if (post.user.toString() !== userId) {

            // user can only delete posts if root user
            if (user.role === "root") {
                await post.remove()
                return res.status(200).send("Post deleted successfully");
            } else {
                return res.status(401).send("Unauthorized");
            }
        }
        // if user is author of post, proceed to delete

        await post.remove()
        return res.status(200).send("Post deleted successfully");

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
})


module.exports = router;
