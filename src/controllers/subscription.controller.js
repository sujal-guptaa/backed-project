import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Suspense } from "react"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!channelId || isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid object Id")
    }
    const subscriberID=req.user?._id
    if(!subscriberID){
        throw new ApiError(401,"Unauthorized request")
    }
    const channel=await User.findById(channelId)
    if(!channel){
        throw new ApiError(404,"Channel not found")
    }
    const existingSuscriber=await Subscription.findOneAndUpdate({
        subscriber:subscriberID,
        channel:channelId
    })

    if(existingSuscriber){
        await Subscription.findByIdAndDelete(existingSuscriber._id)

        return res
        .status(200)
        .json(new ApiResponse(
                200,
                null,
                "Channel unsubscribed successfully"
            )
        )
    }
    const subscription=await Subscription.create({
        subscriber:subscriberID,
        channel:channelId
    })
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscription,
            "Channel subscribed successfully"
        )
    )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId || isValidObjectId(channelId)){
        return new ApiError(400,"Invalid channel ID")
    }
    const channel=await User.findById(channelId)
    if(!channel){
        throw new ApiError(404,"Channel not found")
    }
    const subscribers=await Subscription.find({
        channel:channelId,
    }).populate(
        "subscriber",
        "username fullName avatar"
    );
    return res.status(200).json(
        new ApiResponse(
            200,
            subscribers,
            "Subscribers fetched successfully"
        )
    );
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!subscriberId || isValidObjectId(subscriberId)){
        throw new ApiError(400,"Invalid Subscriber ID")
    }
    const user=await User.findById(subscriberId)
    if(!user){
        throw new ApiError(404,"User not found")
    }
    const SubscribedChannels=await Subscription.find({
        subscriber:subscriberId
    }).populate(
        "channel",
        "username fullName avatar"
    )
    return res
    .status(200)
    .json(
            200,
            SubscribedChannels,
            "Subscribed Channel fetched Successfully"
        )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}