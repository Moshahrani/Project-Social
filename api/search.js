const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");

router.get("/:searchText", authMiddleware, async (req, res) => {
    const { searchText } = req.params;

    if (searchText.length === 0) return;

    // regex expression for our search text
    // searching for user now
    try {
        let userPattern = new RegExp(`^${searchText}`)

        const results = await UserModel.find({

            // not case sensitive
            name: { $regex: userPattern, $options: "i" }
        });

        res.json(results);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
})

module.exports = router;
