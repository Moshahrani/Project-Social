const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const PostModel = require("../models/PostModel");
const ProfileModel = require("../models/ProfileModel");


// get profile Info

router.get("/:username", authMiddleware, async (req, res) => {

    
    try {
        const { username } = req.params;
        
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

// follow a user

router.post("/follow/:userToFollowId", authMiddleware, async (req, res) => {

    
    try {
        const { userId } = req;
        const { userToFollowId } = req.params;
        
        const user = await FollowerModel.findOne({ user: userId });
        const userToFollow = await FollowerModel.findOne({ user: userToFollowId });

        // if either option isn't valid 
        if (!user || !userToFollow) {
            return res.status(404).send("User not found");
        }
        // checking if user is already following user
        const isFollowing =
            user.following.length > 0 &&
            user.following.filter(following => following.user.toString() === userToFollowId)
                .length > 0;

        // user is already being followed
        if (isFollowing) {
            return res.status(401).send("User Already Followed");
        }
        // adding followed user info to user's following list 
        await user.following.unshift({ user: userToFollowId });
        await user.save();

        // adding user to followers of user being followed
        await userToFollow.followers.unshift({ user: userId });
        await userToFollow.save();

        return res.status(200).send("Success");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
});

// unfollow a user

router.put("/unfollow/:userToUnfollowId", authMiddleware, async (req, res) => {

    
    try {
        const { userId } = req;
        const { userToUnfollowId } = req.params;
        
        const user = await FollowerModel.findOne({
            user: userId
        });

        const userToUnfollow = await FollowerModel.findOne({
            user: userToUnfollowId
        });

        if (!user || !userToUnfollow) {
            return res.status(404).send("User not found");
        }
        // if length = 0, user has never followed them before

        const isFollowing =
            user.following.length > 0 &&
            user.following.filter(
                following => following.user.toString() === userToUnfollowId
            ).length === 0;

        if (isFollowing) {
            return res.status(401).send("User Not Followed before");
        }

        const removeFollowing = await user.following
            .map(following => following.user.toString())
            .indexOf(userToUnfollowId);

        // splice followed user from array
        await user.following.splice(removeFollowing, 1);
        await user.save();

        // remove follower as well "user that unfollowed" 
        const removeFollower = await userToUnfollow.followers
            .map(follower => follower.user.toString())
            .indexOf(userId);

        await userToUnfollow.followers.splice(removeFollower, 1);
        await userToUnfollow.save();

        return res.status(200).send("Updated");
    } catch (error) {
        console.error(error);
        res.status(500).send("server error");
    }
});
