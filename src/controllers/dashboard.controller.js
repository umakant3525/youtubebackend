import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"


// TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = "660aacb4cddd38d423a2202f";

    // Ensure the channel exists
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // // Calculate total video views
    // const totalVideoViews = await Video.aggregate([
    //     { $match: { owner: mongoose.Types.ObjectId(channelId) } },
    //     { $group: { _id: null, views: { $sum: "$views" } } }
    // ]);

    // if (!totalVideoViews || totalVideoViews.length === 0) {
    //     // Consider returning a more specific error message
    //     throw new ApiError(404, "No video views found for this channel");
    // }

    // // Count total subscribers
    // const totalSubscribers = await Subscription.countDocuments({ channel: mongoose.Types.ObjectId(channelId) });

    // // Count total videos
    // const totalVideos = await Video.countDocuments({ owner: mongoose.Types.ObjectId(channelId) });

    // // Calculate total likes
    // const totalLikes = await Like.aggregate([
    //     { $match: { channel: mongoose.Types.ObjectId(channelId) } },
    //     { $group: { _id: null, likes: { $sum: 1 } } }
    // ]);

    // if (!totalLikes || totalLikes.length === 0) {
    //     // Consider returning a more specific error message
    //     throw new ApiError(404, "No likes found for this channel");
    // }

    // const data = {
    //     totalVideoViews: totalVideoViews[0].views,
    //     totalSubscribers,
    //     totalVideos,
    //     totalLikes: totalLikes[0].likes
    // };

    return res.status(200).json(new ApiResponse(200, channel, "Dashboard info retrieved successfully"));
});





const getChannelVideos = asyncHandler(async (req, res) => {
     // TODO: Get all the videos uploaded by the channel
    const userId = req.user._id;

    const videos = await Video.find({ owner: userId }, 'videoFile');

    if (!videos || videos.length === 0) {
        throw new ApiError(404, "No videos found for the channel");
    }

    const videoUrls = videos.map(video => video.videoFile);

    return res.status(200).json(new ApiResponse(200, videoUrls, "Video URLs for the channel retrieved successfully"));
});


export {
    getChannelStats, 
    getChannelVideos
    }