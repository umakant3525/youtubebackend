import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
     //TODO: create playlist
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "Playlist name and description are required");
    }

    try {
        var playlistObject = await Playlist.create({
            name,
            description,
            videos: [], // Initialize videos array with an empty array
            owner: req.user._id 
        });

    } catch (error) {
        throw new ApiError(500, "Error creating playlist");
    }
    res.status(201).json(new ApiResponse(200, playlistObject, "Playlist created successfully"));

});

const getUserPlaylists = asyncHandler(async (req, res) => {
    // TODO : get user playlists
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const userPlaylists = await Playlist.find({ owner: userId });

    if (!userPlaylists || userPlaylists.length === 0) {
        throw new ApiError(404, "User playlists not found");
    }

    res.status(200).json(new ApiResponse(200, userPlaylists, "User playlists retrieved successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    // TODO : get user playlists
    const {playlistId} = req.params

    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(new ApiResponse(200, playlist, "Plalist by id retrieved successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    // TODO : add videos to playlist

    //{{server}}/playlist/add/videoId/playlistId

    const {videoId, playlistId} = req.params;

    const isVideoExist = await Video.findById(videoId);
    if (!isVideoExist) {
        throw new ApiError(404, 'Video not found');
    }

        const playlist = await Playlist.findById(playlistId);
        if (playlist.videos.includes(videoId)) {
            throw new ApiError(400, 'Video already exists in playlist');
        }

    try {
            const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $push: { videos: videoId } },
            { new: true } 
        );

        if (!updatedPlaylist) {
            throw new ApiError(404, 'Playlist not found');
        }

        res.status(200).json(new ApiResponse(200, updatedPlaylist, 'Video added to playlist successfully'));
    } catch (error) {
        throw new ApiError(500, 'Error adding video to playlist');
    }
});


// const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
//     const {playlistId, videoId} = req.params
//     // TODO: remove video from playlist

// })
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    const isVideoExist = await Video.findById(videoId);
    if (!isVideoExist) {
        throw new ApiError(404, 'Video not found');
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist || !playlist.videos.includes(videoId)) {
        throw new ApiError(400, 'Video does not exist in playlist');
    }

    try {
        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $pull: { videos: videoId } },
            { new: true }
        );

        if (!updatedPlaylist) {
            throw new ApiError(404, 'Playlist not found');
        }

        res.status(200).json(new ApiResponse(200, updatedPlaylist, 'Video removed from playlist successfully'));
    } catch (error) {
        throw new ApiError(500, 'Error removing video from playlist');
    }
});



const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
