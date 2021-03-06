const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");

const loadMessages = async (userId, messagesWith) => {

    try {
        // receive user info from messagesWith of user and current user
        const user = await ChatModel.findOne({ user: userId }).populate("chats.messagesWith")

        // load messages with that particular user 
        const chat = user.chats.find(chat => chat.messagesWith._id.toString() === messagesWith)

        // if no chat

        if (!chat) {
            return { error: "No chat found" };
        }
        return { chat };

    } catch (error) {
        console.log(error);
        return { error };
    }
};


const sendMsg = async (userId, msgSendToUserId, msg) => {

    try {
        // sender or logged in user 
        const user = await ChatModel.findOne({ user: userId })
        // receiver
        const msgSendToUser = await ChatModel.findOne({ user: msgSendToUserId })

        const newMsg = {
            sender: userId,
            receiver: msgSendToUserId,
            msg,
            date: Date.now()
        }

        // check for previous chat with user 
        // if so, save message to that existing chat log
        const prevChat = user.chats.find(chat => chat.messagesWith.toString() === msgSendToUserId)

        if (prevChat) {
            prevChat.messages.push(newMsg);
            await user.save();
        }
        // else create whole new chat with ChatModel properties
        else {

            const newChat = { messagesWith: msgSendToUserId, messages: [newMsg] }
            user.chats.unshift(newChat);
            await user.save();
        }

        // same as above method but now for receiver of chat
        const prevChatReceiver = msgSendToUser.chats.find(
            chat => chat.messagesWith.toString() === userId)

        if (prevChatReceiver) {
            prevChatReceiver.messages.push(newMsg);
            await msgSendToUser.save();
        }
        // else create whole new chat with ChatModel properties
        else {
            const newChat = { messagesWith: userId, messages: [newMsg] }
            msgSendToUser.chats.unshift(newChat);
            await msgSendToUser.save();
        }

        return { newMsg }

    } catch (error) {
        console.error(error);
        return { error }
    }
}

// will set message to unread 
const setMsgToUnread = async userId => {

    try {
        const user = await UserModel.findById(userId);

        // if unread message false, set to true
        if (!user.unreadMessage) {
            user.unreadMessage = true;
            await user.save();
        }

        return;
    } catch (error) {
        console.error(error);
    }
};

// delete message from chat 
const deleteMsg = async (userId, messagesWith, messageId) => {

    try {

        const user = await ChatModel.findOne({ user: userId })

        const chat = user.chats.find(chat => chat.messagesWith.toString() === messagesWith)

        if (!chat) {
            return;
        }

        const messageToDelete = chat.messages.find(
            message => message._id.toString() === messageId)

        if (!messageToDelete) return;

        // if you're not the sender of the message to delete
        if (messageToDelete.sender.toString() !== userId) {
            return;
        }
        // find index of messages in array and then delete
        const index = chat.messages
            .map(message => message._id.toString())
            .indexOf(messageToDelete._id.toString());

        await chat.messages.splice(index, 1);

        await user.save();

        // success value to show function was called successfully
        return { success: true }

    } catch (error) {
        console.log(error)
    }
}


module.exports = { loadMessages, sendMsg, setMsgToUnread, deleteMsg };