import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
 //TODO: create tweet

    if (!content) {
        throw new ApiError(400, "Something comment is  required");
    }

    const tweetObject = await Tweet.create({
      content,
      owner: req.user._id 
    });

    return res.status(201).json(
        new ApiResponse(200, tweetObject, "Tweet added successfully")
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO : get user tweets
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const userTweets = await Tweet.find({ owner: userId });

    if (!userTweets || userTweets.length === 0) {
        throw new ApiError(404, "User tweets not found");
    }

    res.status(200).json(new ApiResponse(200, userTweets, "User tweets retrieved successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!tweetId) {
        throw new ApiError(400, "Tweet ID is required");
    }

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    try {
        const tweet = await Tweet.findById(tweetId);
        
        if (!tweet) {
            throw new ApiError(404, "Tweet not found");
        }

        tweet.content = content;

        const updatedTweet = await tweet.save();

    } catch (error) {
        throw new ApiError(500, "Error updating tweet");
    }
    
    res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));

});


const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
