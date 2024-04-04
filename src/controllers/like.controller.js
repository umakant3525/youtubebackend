import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;
    //TODO : toggle video like 

    try {
        const existingLike = await Like.findOneAndDelete({ video: videoId, likedBy: userId });

        if (existingLike) {
            return res.status(200).json(new ApiResponse(200, {}, "Video like removed successfully"));
        } else {
            await Like.findOneAndUpdate(
                { video: videoId, likedBy: userId },
                { video: videoId, likedBy: userId },
                { upsert: true }
            );
            return res.status(200).json(new ApiResponse(200, {}, "Video liked successfully"));
        }
    } catch (error) {
        throw new ApiError(500, "Error working on video like");
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    //TODO : toggle comment like 

    try {
        const existingLike = await Like.findOneAndDelete({ comment: commentId, likedBy: userId });
    
        if (existingLike) {
            return res.status(200).json(new ApiResponse(200, null, "Comment like removed successfully"));
        } else {
            await Like.findOneAndUpdate(
                { comment: commentId, likedBy: userId },
                { comment: commentId, likedBy: userId },
                { upsert: true }
            );
            return res.status(200).json(new ApiResponse(200, null, "Comment liked successfully"));
        }
    } catch (error) {
        throw new ApiError(500, "Error working on comment like");
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;
    //TODO : toggle tweet like 

    try {
        const existingLike = await Like.findOneAndDelete({ tweet: tweetId, likedBy: userId });

        if (existingLike) {
            return res.status(200).json(new ApiResponse(200, null, "Tweet like removed successfully"));
        } else {
            await Like.findOneAndUpdate(
                { tweet: tweetId, likedBy: userId },
                { tweet: tweetId, likedBy: userId },
                { upsert: true }
            );
            return res.status(200).json(new ApiResponse(200, null, "Tweet liked successfully"));
        }
    } catch (error) {
        throw new ApiError(500, "Error working on tweet like");
    }
});



const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    //TODO : get all liked videos
    try {
        const likedVideos = await Like.find({ likedBy: userId, video: { $exists: true } }).populate('video');
        // Assuming 'video' field in Like model references the video document
        return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}