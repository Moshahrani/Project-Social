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

module.exports = router;
