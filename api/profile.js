const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const PostModel = require("../models/PostModel");
const ProfileModel = require("../models/ProfileModel");


// get profile Info

router.get("/:username", authMiddleware, async (req, res) => {
    const { username } = req.params;

    try {


        const user = await UserModel.findOne({ username: username.toLowerCase() })

        if (!user) {
            return res.status(404).send("User not found");
        }

        const profile = await ProfileModel.findOne({ user: user._id }).populate("user");

        const profileFollowStats = await FollowerModel.findOne({ user: user._id });

        return res.json({
            profile,
            followersLength: profileFollowStats.followers.length > 0 ? profileFollowStats.followers.length : 0,
            followingLength: profileFollowStats.following.length > 0 ? profileFollowStats.following.length : 0
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");

    }



})

// get posts of user 

router.get(`/posts/:username`, authMiddleware, async (req, res) => {
    try {
        const { username } = req.params;

        const user = await UserModel.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(404).send("No User Found");
        }
        // return all posts of user, sort by most recent
        const posts = await PostModel.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate("user")
            .populate("comments.user");

        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
});

// get followers of user

router.get("/followers/:userId", authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await FollowerModel.findOne({ user: userId }).populate(
            "followers.user"
        );

        return res.json(user.followers);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
});

// get following of user 

router.get("/following/:userId", authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await FollowerModel.findOne({ user: userId }).populate(
            "following.user"
        );

        return res.json(user.following);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
});
