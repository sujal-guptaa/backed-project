import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if(!name || !description){
        throw new ApiError(400,"All fields are requried")
    }
    const userId=req.user?._id;
    if(!userId){
        throw new ApiError(401,"Unauthorized request")
    }
    const playlist=await Playlist.create({
        name:name.trim(),
        description:description.trim(),
        owner:userId
    })
    if(!playlist){
        throw new ApiError(500,"Something went wrong while creating playlist")
    }
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "Playlist created successfully"
        )
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(isValidObjectId(userId)){
        throw new ApiError(400,"Unauthorized request")
    }
    const playlists=await Playlist.find({
        owner:userId
    })
    return res.status(200)
    .json(new ApiResponse(
        200,
        playlists,
        "User playlist fetched successfuly"
    ))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(isValidObjectId(playlistId)){
        throw new ApiError(401,"Invlaid playlist id")
    }
    const playlist = await Playlist.findById(playlistId)
        .populate("videos", "title thumbnail duration")
        .populate("owner", "username avatar");

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Playlist fetched successfully"
        )
    );
})
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist ID");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in playlist");
    }

    playlist.videos.push(videoId);

    await playlist.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Video added to playlist successfully"
        )
    );
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist ID");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    playlist.videos = playlist.videos.filter(
        (id) => id.toString() !== videoId
    );

    await playlist.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Video removed from playlist successfully"
        )
    );
    

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this playlist");
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Playlist deleted successfully"
        )
    );
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
     if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist ID");
    }

    if (!name?.trim() && !description?.trim()) {
        throw new ApiError(
            400,
            "Please provide name or description to update"
        );
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this playlist");
    }

    if (name?.trim()) {
        playlist.name = name.trim();
    }

    if (description?.trim()) {
        playlist.description = description.trim();
    }

    await playlist.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Playlist updated successfully"
        )
    );
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