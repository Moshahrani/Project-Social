const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");

router.get("/:searchText", authMiddleware, async (req, res) => {

    const { searchText } = req.params;
    const { userId } = req;

    try {
        //console.log(searchText)

        //if (searchText.length === 0) return;

        // searching for user now     
        const results = await UserModel.find({
            // not case sensitive "i" option
            name: { $regex: searchText, $options: "i" }
        });

        // will search for users that aren't the user themselves
        const resultsToSend = results.length > 0
            && results.filter(result => result._id.toString() !== userId)

        return res.json(resultsToSend);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
})

module.exports = router;
