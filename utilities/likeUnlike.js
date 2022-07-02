const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");

const {
    newLikeNotification,
    removeLikeNotification
} = require("../utilities/notificationEvents");


const likeUnlike = async (postId, userId, like) => {

    try {

        const post = await PostModel.findById(postId);
        // if no post was found 
        if (!post) {
            return { error: "No post was found" }
        }
        // checking if user wants to like post 
        if (like) {
            // seeing if already liked before
            const liked = post.likes.filter(like => like.user.toString() === userId).length > 0
            // if so, then error
            if (liked) {
                return { error: "Post was liked before" }
            }

            await post.likes.unshift({ user: userId })
            await post.save();

            // if liking own post, no notification to user
            if (post.user.toString() !== userId) {
                await newLikeNotification(userId, postId, post.user.toString());
            }
        }
        else {
            const liked =
                post.likes.filter(like => like.user.toString() === userId).length === 0;

            if (liked) {
                return { error: "Post was not liked before" }
            }
            // give the index of the user Id in the likes array
            const index = post.likes.map(like => like.user.toString()).indexOf(userId)

            await post.likes.splice(index, 1)
            await post.save();

             // checking if liking own post
             if (post.user.toString() !== userId) {
                await removeLikeNotification(userId, postId, post.user.toString());
            }
        }
        // everything was done successfully whether liked or unliked
        return { success: true }

    } catch (error) {
        return { error: "Server error" };
    }
}

module.exports = { likeUnlike };