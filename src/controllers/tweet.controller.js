import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const user=req.user?._id;
    if(!user){
        throw new ApiError(401,"Unauthroized request")
    }
    const {content}=req.body
    if(!content?.trim()){
        return new ApiError(400,"Content is requried.")
    }
    const tweet=await Tweet.create({
        content:content.trim(),
        owner:user
    })
    return res.status(201)
                .json(new ApiResponse(
                    201,
                    tweet,
                    "Tweet successfully created."
                ))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId}=req.params
    if(!userId || !isValidObjectId(userId)){
        throw new ApiError(400,"Invalid User Id")
    }
    const user=await User.findById(userId);
    if(!user){
        throw new ApiError(404,"User not found.")
    }
    const tweet=await Tweet.find({
        owner:userId
    }).sort({createdAt:-1});

    return res.status(200)
                .json(new ApiResponse(
                    200,
                    tweet,
                    "Tweet fetched successfully"
                ))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}