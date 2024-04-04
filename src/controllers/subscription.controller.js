import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user._id;

    try {
        const existingSubscription = await Subscription.findOneAndDelete({ subscriber: subscriberId, channel: channelId });

        if (existingSubscription) {
            return res.status(200).json(new ApiResponse(200, null, "Subscription toggled off successfully"));
        } else {
            const newSubscription = new Subscription({ subscriber: subscriberId, channel: channelId });
            await newSubscription.save();
            return res.status(200).json(new ApiResponse(200, null, "Subscription toggled on successfully"));
        }
    } catch (error) {
        throw new ApiError(500, "Error toggling subscription: " + error.message);
    }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}