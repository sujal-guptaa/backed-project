import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400,"Please Provide valid video Id.")
    }

    const pageNumber=Number(page);
    const maxlimit=Number(limit);
    const skip=(pageNumber-1)*maxlimit;

    const comments=await Comment.find({video:videoId})
                                .sort({createdAt:-1})
                                .skip(skip)
                                .limit(maxlimit)
    return res.status(200)
              .json(
                new ApiResponse(
                    200,
                    comments,
                    "Comment fetched successfully."
                )
            );
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    // Get comment content
    const {commentContent}=req.body;
    if(!commentContent?.trim()){
        throw new ApiError(400,"Comment content is required.")
    }
     // Get logged-in user
    const userId=req.user?._id;
    if(!userId){
        throw new ApiError(400,"User does not exist.")
    }
    // Get video ID from URL
    const {videoId}=req.params;
    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400,"Please provide video ID.")
    }
    // Create comment
    const comment=await Comment.create({
        content: commentContent.trim(),
        video:videoId,
        owner:userId
    })
    return res.status(200)
                .json(
                    new ApiResponse(
                        200,
                        comment,
                        "Comment save successfully"
                    )
                );
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentContent}=req.body
    if(!commentContent.trim()){
        throw new ApiError(400,"Comment content is required.")
    }
    const {commentId}=req.params
    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400,"Please provide a valid comment ID.")
    }
    const comment=await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner: req.user._id
        },
        {
            $set:{
                content:commentContent.trim()
            }
        },
        {new:true}
    )
    if (!comment) {
        throw new ApiError(404, "Comment not found.");
    }
    return res.status(200)
                .json(new ApiResponse(
                    200,
                    "comment updated successfully"
                ))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params;
    // Validate comment ID
    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400,"comment Id is not valid")
    }
    // Delete comment
    const comment = await Comment.findByIdAndDelete(commentId);
     // Check if comment exists
    if (!comment) {
        throw new ApiError(404, "Comment not found.");
    }
    return res.status(200)
                .json(new ApiResponse(200,"Comment deleted successfully"))
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }