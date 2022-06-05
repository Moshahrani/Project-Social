const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");

router.get("/:searchText", authMiddleware, async (req, res) => {
    const { searchText } = req.params;

    try {
      //console.log(searchText)

      //if (searchText.length === 0) return;

    // searching for user now     
        const results = await UserModel.find({
            // not case sensitive "i" option
            name: { $regex: searchText, $options: "i" }
        });

        return res.json(results);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
})

module.exports = router;
  