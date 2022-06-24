const UserModel = require("../models/UserModel");
const NotificationModel = require("../models/NotificationModel");

export const setNotificationToUnread = async userId => {
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
export const newLikeNotification = async (userId, postId, userToNotifyId) => {
    try {
        const userToNotify = await NotificationModel.findOne({ user: userToNotifyId });

        const newNotification = {
            type: "newLike",
            user: userId,
            post: postId,
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

// notify user of their post when unliked by another user
export const removeLikeNotification = async (userId, postId, userToNotifyId) => {

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

