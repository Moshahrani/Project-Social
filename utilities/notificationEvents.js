const UserModel = require("../models/UserModel");
const NotificationModel = require("../models/NotificationModel");

const setNotificationToUnread = async userId => {

    try {
        const user = await UserModel.findById(userId);

        if (!user.unreadNotification) {
            user.unreadNotification = true;
            await user.save();
        }

        return;
    } catch (error) {
        console.error(error);
    }
};

// notify user of post when a new like occurs 
const newLikeNotification = async (userId, postId, userToNotifyId) => {
    try {
        const userToNotify = await NotificationModel.findOne({ user: userToNotifyId });

        const newNotification = {
            type: "newLike",
            user: userId,
            post: postId,
            date: Date.now()
        };
        // pass new notification to user's notifications
        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();

        await setNotificationToUnread(userToNotifyId);
        return;
    } catch (error) {
        console.error(error);
    }
};

// notify user of their post when unliked by another user
const removeLikeNotification = async (userId, postId, userToNotifyId) => {

    try {
        // using pull operator to remove the notification 
        // from notifications array

        await NotificationModel.findOneAndUpdate(
            { user: userToNotifyId },
            {
                $pull: {
                    notifications: {
                        type: "newLike",
                        user: userId,
                        post: postId
                    }
                }
            }
        );

        return;
    } catch (error) {
        console.error(error);
    }
};

// notify user when a new comment appears in their post
const newCommentNotification = async (
    postId,
    commentId,
    userId,
    userToNotifyId,
    text
) => {

    try {

        const userToNotify = await NotificationModel.findOne({ user: userToNotifyId });

        const newNotification = {
            type: "newComment",
            user: userId,
            post: postId,
            commentId,
            text,
            date: Date.now()
        };

        await userToNotify.notifications.unshift(newNotification);

        await userToNotify.save();

        await setNotificationToUnread(userToNotifyId);
        return;

    } catch (error) {
        console.error(error);
    }
};

// notify user when another user removes a comment from their post 
const removeCommentNotification = async (postId, commentId, userId, userToNotifyId) => {
    
    try {
        await NotificationModel.findOneAndUpdate(
            { user: userToNotifyId },
            {
                $pull: {
                    notifications: {
                        type: "newComment",
                        user: userId,
                        post: postId,
                        commentId: commentId
                    }
                }
            }
        );

        return;
    } catch (error) {
        console.error(error);
    }
};

// notify user of a new follower 
const newFollowerNotification = async (userId, userToNotifyId) => {

    try {
        const user = await NotificationModel.findOne({ user: userToNotifyId });

        const newNotification = {
            type: "newFollower",
            user: userId,
            date: Date.now()
        };

        await user.notifications.unshift(newNotification);

        await user.save();

        await setNotificationToUnread(userToNotifyId);
        return;
    } catch (error) {
        console.error(error);
    }
};

// notify user of when a follower unfollows 
const removeFollowerNotification = async (userId, userToNotifyId) => {

    try {
          //   pull operator removes all instances of a value
           //  from an existing array
        await NotificationModel.findOneAndUpdate(
            { user: userToNotifyId },

            { $pull: { notifications: { type: "newFollower", user: userId } } }
        );

        return;
    } catch (error) {
        console.error(error);
    }
};

module.exports= {
    setNotificationToUnread,
    newLikeNotification,
    removeLikeNotification,
    newCommentNotification,
    removeCommentNotification,
    newFollowerNotification,
    removeFollowerNotification
}