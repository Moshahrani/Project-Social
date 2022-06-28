const ChatModel = require("../models/ChatModel");

const loadMessages = async (userId, messageWith) => {

    try {
          // receive user info from messagesWith of user and current user
        const user = await ChatModel.findOne({ user: userId }).populate("chats.messagesWith")

         // load messages with that particular user 
        const chat = user.chats.find(chat => chats.messageWith._id.toString() === messagesWith)
        
        // if no chatß

        if (!chat) {
            return { error: "No chat found" };
        }
        
        return { chat };

    } catch (error) {
        console.log(error);
        return { error };
    }
};

module.exports = { loadMessages };