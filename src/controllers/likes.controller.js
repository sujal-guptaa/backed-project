import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js";
import {Comment} from "../models/comment.models.js"
import { Tweet } from "../models/tweet.models.js"
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!videoId || !isValidObjectId(videoId)){
        throw new ApiError(400,"Video Id is invalid...")
    }
    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Video not found...")
    }
    const user=req.user?._id
    const existingLike=await Like.findOne({
        video:videoId,
        likedBy: user
    })
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200)
                    .json(new ApiResponse(
                        200,
                        null,
                        "Video unliked sucessfully"
                    ))
    }
    const like=await Like.create({
        video:videoId,
        likedBy:user
    })
    return res.status(200)
                .json(new ApiResponse(
                    200,
                    like,
                    "Video liked sucessfully"
                ))
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!commentId || !isValidObjectId(commentId)){
        throw new ApiError(400,"comment Id is not valid...")
    }
    const comment=await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404,"Comment not found..")
    }
    const user=req.user?._id;
    if(!user){
        throw new ApiError(401,"Unauthorized request")
    }
    const existingLike=await Like.findOne({
        comment:commentId,
        likedBy:user
    })
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200)
                    .json(new ApiResponse(
                        200,
                        null,
                        "Comment unliked successfully"
                        )
                    )
    }
    const like=await Like.create({
        comment:commentId,
        likedBy:user
    })
    return res.status(201)
                .json(new ApiResponse(
                    201,
                    like,
                    "Liked comment successfully"
                ))
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!tweetId || !isValidObjectId(tweetId)){
        throw new ApiError(400,"")
    }
    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"Tweet not found")
    }
    const user=req.user?._id
    if(!user){
        throw new ApiError(401,"Unauthroized request.")
    }
    const existingLike=await Like.findOne({
        tweet:tweetId,
        likedBy:user
    })
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)

        return res.status(200
                    .json(new ApiResponse(
                        200,
                        null,
                        "Twwet unliked successfully"
                    ))
        )
    }
    const like=await Like.create({
        tweet:tweetId,
        likedBy:user
    })
    return res.status(200)
                .json(new ApiResponse(
                    200,
                    like,
                    "Tweet liked successfully"
                ))
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const user=req.user?._id;
    if(!user){
        throw new ApiError(401,"Unauthorized request.")
    }
    const likedVideo=await Like.find({
        likedBy:user,
        video:{$exists:true}
    })
        .populate({
            path:"video",
            select:"-videoPublicID -thumbnailPublicID -__v"
        })
    const videos=likedVideo.map((like)=>like.video);
    return res.status(200)
                .json(new ApiResponse(
                    200,
                    videos,
                    "Liked videos fetched successfully"
                ))
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}