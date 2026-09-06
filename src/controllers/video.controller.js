import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    console.log("get api of video is hit ! ")
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
    // 1.validate UserId
    if (!userId) {
        throw new ApiError(400, "User Id is requried!");
    }
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User Id");
    }
    // 2.filter User
    const filter = {
        owner: userId,
    };

    // 3.search title and description
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
        ];
    }

    // 4.Pagination
    const pageNumber = Number(page);
    const pagelimit = Number(limit);

    const skip = (pageNumber - 1) * pagelimit;

    // 5.Sorting
    const sortOrder = sortType === "asc" ? 1 : -1;

    const sort = sortBy ? { [sortBy]: sortOrder } : { createdAt: -1 };

    // 6.Get videoa

    const videos = await Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pagelimit)
        .select("-videoPublicID -thumbnailPublicID -__v");
    const totalVideos = await Video.countDocuments(filter);
    const totalPages = Math.ceil(totalVideos / pagelimit);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                videos,
                pagination: {
                    page: pageNumber,
                    limit: pagelimit,
                    totalVideos,
                    totalPages,
                },
            },
            "Videos fetched successfully"
        )
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    // TODO: get video, upload to cloudinary, create video
    if ([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All field are required.")
    }
    const videoLocalPath = req.files.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files.thumbnail?.[0]?.path;
    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "All fields are required.")
    }
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile || !thumbnail) {
        throw new ApiError(500, "Something went wrong while uploading the video file and thumbnail.")
    }
    const user = req.user?._id;
    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.secure_url,
        videoPublicID: videoFile.public_id,
        thumbnail: thumbnail.secure_url,
        thumbnailPublicID: thumbnail.public_id,
        duration: videoFile.duration,
        isPublished: true,
        owner: user
    })
    if (!video) {
        throw new ApiError(500, "Something went wrong while publishing the video.")
    }
    return res.status(200).json(new ApiResponse(201, video, "Video uploaded successfully"))
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: get video by id
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Please provide a valid video ID.")
    }
    const video = await Video.findById(videoId).select("-videoPublicID -thumbnailPublicID -__v")
    if (!video) {
        throw new ApiError(400, "Video not found.")
    }
    return res.status(200).json(new ApiResponse(200, video, "Video Fetched Successfully"))
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: update video details like title, description, thumbnail
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Please provide a valid video ID.")
    }
    const { title, description } = req.body;
    const thumbnailLocalPath = req.file?.path;
    if (!title?.trim() && !description?.trim() && !thumbnailLocalPath) {
        throw new ApiError(400, "No fields provided for update. Please provide at least one field to update.")
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }
    if (title?.trim()) {
        video.title = title.trim();
    }
    if (description?.trim()) {
        video.description = description.trim();
    }
    if (thumbnailLocalPath) {
        const oldthumbnailPath = video.thumbnailPublicID;
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (!thumbnail) {
            throw new ApiError(500, "Error occurred while updating the thumbnail.")
        }
        try {
            if (oldthumbnailPath) {
                await deleteOnCloudinary(oldthumbnailPath);
            }
        } catch (error) {
            throw new ApiError(500, "Something went wrong while deleting thumnbail");
        }
        video.thumbnail = thumbnail.secure_url;
        video.thumbnailPublicID = thumbnail.public_id;
    }
    await video.save();
    return res.status(200).json(new ApiResponse(200, "Video updated Successfully"))
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Please provide a valid video ID.")
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const videoPath = video.videoPublicID;
    const thumbnailPath = video.thumbnailPublicID;
    try {
        if (videoPath) {
            await deleteOnCloudinary(videoPath);
        }
        if (thumbnailPath) {
            await deleteOnCloudinary(thumbnailPath);
        }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting the video or thumbnail")
    }
    const deletevideo = await Video.findByIdAndDelete(videoId);
    if (!deleteVideo) {
        throw new ApiError(500, "Failed to delete video from database.");
    }
    return res
        .status(200)
        .json(200, "Video deleted successfully")
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
