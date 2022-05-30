const express = require("express")
const router = express.Router();
const UserModel = require("../models/UserModel")
const ProfileModel = require("../models/ProfileModel");
const FollowerModel = require("../models/FollowerModel");
const jsonwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/")

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

router.get("/:username", async (req, res) => {
    const { username } = req.params;

    try {
        if (username.length < 1) {
            return res.status(401).send("Invalid")
        }
        if (!regexUserName.test(username)) {
            return res.status(401).send("Invalid");
        }

        const user = await UserModel.findOne({ username: username.toLocaleLowerCase() })

        if (user) {
            return res.status(401).send("Username is already in use");
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
})

router.post("/", async (req, res) => {
    const {
        name,
        email,
        password,
        bio,
        facebook,
        twitter,
        instagram,
        youtube,
    } = req.body.user;

    if (!isEmail(email)) {
        return res.status(401).send("Invalid");
    }
    if (password.length < 6) {
        return res.status(401).send("Password must be at least 6 characters")
    }

    try {
        let user = await UserModel.findOne({ email: email.toLowerCase() })

        if (user) {
            return res.status(401).send("User already registered")
        }

        user = new UserModel({
            name,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password,
            profilePicUrl: req.body.profilePicUrl || user
        });

        user.password = await bcrypt.hash(password, 10);
        await user.save();


        let profileFields = {}
        profileFields.user = user._id
        profileFields.bio = bio
        profileFields.social = {}
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (youtube) profileFields.social.youtube = youtube;

        await new ProfileModel(profileFields).save();
        await new FollowerModel({ user: user._id, followers: [], following: [] }).save();

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

