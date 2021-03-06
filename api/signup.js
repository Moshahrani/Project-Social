const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel")
const ProfileModel = require("../models/ProfileModel");
const FollowerModel = require("../models/FollowerModel");
const NotificationModel = require("../models/NotificationModel");
const ChatModel = require("../models/ChatModel");
const jsonwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const userPic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

// checking if username is already in use

router.get("/:username", async (req, res) => {
    const { username } = req.params;
    console.log(username);
    try {
        if (username.length < 1) {
            return res.status(401).send("Invalid")
        }
        if (!regexUserName.test(username)) {
            return res.status(401).send("Invalid");
        }

        const user = await UserModel.findOne({ username: username.toLowerCase() });

        if (user) {
            return res.status(401).send("Username is already in use");
        }
        return res.status(200).send("Available");

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
})

// enrolling new user's information to the backend

router.post("/", async (req, res) => {
    const {
        name,
        email,
        username,
        password,
        bio,
        facebook,
        twitter,
        instagram,
        youtube,
    } = req.body.user;

    if (!isEmail(email)) {
        return res.status(401).send("Invalid email");
    }
    if (password.length < 6) {
        return res.status(401).send("Password must be at least 6 characters")
    }

    try {
        let user;
        user = await UserModel.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(401).send("User is already registered");
        }

        user = await UserModel.findOne({ username: username.toLowerCase() });
        if (user) {
            return res.status(401).send("Username is already in use");
        }


        user = new UserModel({
            name,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password,
            profilePicUrl: req.body.profilePicUrl || userPic
        });

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        // adding any social media links to profile model

        let profileFields = {};
        profileFields.user = user._id;
        profileFields.bio = bio;
        profileFields.social = {};
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (youtube) profileFields.social.youtube = youtube;

        await new ProfileModel(profileFields).save();
        await new FollowerModel({ user: user._id, followers: [], following: [] }).save();
        await new NotificationModel({ user: user._id, notifications: [] }).save();
        await new ChatModel({ user: user._id, chats: [] }).save();

        // sending token back to frontend 

        const payload = { userId: user._id };
        jsonwt.sign(payload, process.env.jsonwtSecret, { expiresIn: "3d" }, (err, token) => {
            if (err) throw err;
            res.status(200).json(token);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
})


module.exports = router;

