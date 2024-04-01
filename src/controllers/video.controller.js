import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
// TODO: get video, upload to cloudinary, create video is completed fully 

    if (!title || !description) {
        throw new ApiError(400, "All fields are required");
    }

     let videoLocalPath;
     let thumbnailLocalPath;
     try {

        if (req.files) {
            if (Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
                videoLocalPath = req.files.videoFile[0].path;
            }

            if (Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
                thumbnailLocalPath = req.files.thumbnail[0].path;
            }
        }
    } catch (error) {
        throw new ApiError(400, "Invalid file path")
    }

    if (!videoLocalPath ) {
        throw new ApiError(400, "Video file is required");
    }

    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    if (!videoUpload ) {
        throw new ApiError(400, "Error while uploading video");
    }

    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnailUpload) {
        throw new ApiError(400, "Error while uploading thumbnail");
    }

    const videoObject = await Video.create({
        title,
        description,
        videoFile: videoUpload.secure_url,
        thumbnail: thumbnailUpload.secure_url || "",
        duration: 0,
        owner: req.user._id 
    });

    return res.status(201).json(
        new ApiResponse(200, videoObject, "Video published successfully")
    );
});



const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
