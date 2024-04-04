import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user._id;

    const existingSubscription = await Subscription.findOneAndDelete({ subscriber: subscriberId, channel: channelId });

    if (existingSubscription) {
        return res.status(200).json(new ApiResponse(200, null, "Subscription toggled off successfully"));
    } else {
        const newSubscription = new Subscription({ subscriber: subscriberId, channel: channelId });
        await newSubscription.save();
        return res.status(200).json(new ApiResponse(200, null, "Subscription toggled on successfully"));
    }
});


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const subscribedChannels = await Subscription.find({ subscriber: userId }).populate('channel', 'name');

    if (!subscribedChannels) {
        throw new ApiError(404, "No subscribed channels found for the user");
    }

    const channelNames = subscribedChannels.map(subscription => subscription.channel.name);

    return res.status(200).json(new ApiResponse(200, { channels: channelNames }, "Subscribed channels retrieved successfully"));
});



// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber', 'username');

    if (!subscribers) {
        throw new ApiError(404, "No subscribers found for the channel");
    }

    const subscriberUsernames = subscribers.map(subscriber => subscriber.subscriber.username);

    return res.status(200).json(new ApiResponse(200, { subscribers: subscriberUsernames }, "Subscriber list retrieved successfully"));
});




// this code works properly but i have check it once for confirmation purpose 


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}