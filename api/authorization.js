const express = require("express")
const router = express.Router();
const UserModel = require("../models/UserModel")
const ProfileModel = require("../models/ProfileModel");
const FollowerModel = require("../models/FollowerModel");
const jsonwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail")

router.post("/", async (req, res) => {
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
