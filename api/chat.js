const express = require("express");
const router = express.Router();
const ChatModel = require("../models/ChatModel");
const authMiddleware = require("../middleware/authMiddleware");

// get all chat logs 
router.get("/", authMiddleware, async (req, res) => {

    try {
        const { userId } = req;

        const user = await ChatModel.findOne({ user: userId }).populate(
            "chats.messagesWith"
        );

        let chatsToBeSent = [];

        // check if chat exists
        if (user.chats.length > 0) {

            // fill chats object with chat data from user
            chatsToBeSent = user.chats.map(chat => ({
                messagesWith: chat.messagesWith._id,
                name: chat.messagesWith.name,
                profilePicUrl: chat.messagesWith.profilePicUrl,
                // want the chat to show the last message sent 
                lastMessage: chat.messages[chat.messages.length - 1].msg,
                date: chat.messages[chat.messages.length - 1].date
            }));
        }

        return res.json(chatsToBeSent);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
});

module.exports = router;
