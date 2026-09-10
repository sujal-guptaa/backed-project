import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, 
    // total subscribers, 
    // total videos, 
    // total likes
    // etc.
    const userId=req.user?._id;
    if(!userId){
        throw new ApiError(401,"unauthorized request")
    }
    const totalVideos=await Video.countDocuments({
        owner:userId
    })
    const totalViews=await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        },{
            $group:{
                _id:null,
                totalViews:{$sum:"$views"}
            }
        }
    ]);
    const totalLikes=await Like.countDocuments({
        video:{
            $in:await Video.find({owner:userId}).distinct("_id")
        }
    });
    const totalSubscriber=await Subscription.countDocuments({
        channel:userId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                totalVideos,
                totalViews:totalViews[0]?.totalViews||0,
                totalLikes,
                totalSubscriber
            },
            "Channel statistics fetched successfully"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId=req.user?._id;
    if(!userId){
        throw new ApiError(401,"Unauthorized request")
    }
    const totlVideos=await Video.find({
        owner:userId
    })
    return res.status(200)
    .json(new ApiResponse(
        200,
        {totlVideos},
        "Videos fetched successfully"
    ))
})

export {
    getChannelStats, 
    getChannelVideos
    }