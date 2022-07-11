const express = require("express")
const router = express.Router();
const UserModel = require("../models/UserModel")
const FollowerModel = require("../models/FollowerModel");
const ChatModel = require("../models/ChatModel");
const jsonwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
    const { userId } = req;

    try {
        const user = await UserModel.findById(userId);

        const userFollowInfo = await FollowerModel.findOne({ user: userId });

        return res.status(200).json({ user, userFollowInfo });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

router.post("/", async (req, res) => {
    console.log(req.body.user)
    const {
        email,
        password,
    } = req.body.user;

    if (!isEmail(email)) {
        return res.status(401).send("Invalid");
    }
    if (password.length < 6) {
        return res.status(401).send("Password must be at least 6 characters")
    }

    try {
        const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
            "+password"
        );

        if (!user) {
            return res.status(401).send("Invalid credentials")
        }

        const isPassword = await bcrypt.compare(password, user.password)

        if (!isPassword) {
            return res.status(401).send("Invalid Credentials")
        };

        // checking if user has a chat model
        const chatModel = await ChatModel.findOne({ user: user._id })

        // adding a chat model if user doesn't have one
        if (!chatModel) {
            await new ChatModel({ user: user._id, chats: [] }).save();
        }

        // sending token back to frontend 

        const payload = { userId: user._id };
        jsonwt.sign(payload, process.env.jsonwtSecret, { expiresIn: "2d" }, (err, token) => {
            if (err) throw err;
            res.status(200).json(token);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
})


module.exports = router;
