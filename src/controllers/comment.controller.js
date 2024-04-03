import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content || !videoId) {
        throw new ApiError(400, "Content and video ID are required");
    }
    // Check if the user has already commented on the video
    const existingComment = await Comment.findOne({ video: videoId, owner: req.user._id });
    if (existingComment) {
        throw new ApiError(400, "You can only comment once on this video");
    }

    try {
        var commentObject = await Comment.create({
            content,
            video: videoId,
            owner: req.user._id
        });

    } catch (error) {
        throw new ApiError(500, "Error adding comment");
    }
    return res.status(201).json(
        new ApiResponse(200, commentObject, "Comment added successfully")
    );
});



const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
