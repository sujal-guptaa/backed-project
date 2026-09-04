import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshTookens=async(userId)=>{
    //first find userId and then generate Access and refresh Token  
        try {
            const user=User.findById(userId)
            const accessToken=user.generateAccessToken()
            const refreshToken=user.generateRefreshToken()
            user.refreshToken=refreshToken
            await user.save({ validateBeforeSave: false })

            return {accessToken,refreshToken}
        } catch (error) {
            throw new ApiError(500,"Something went wrong while generating referesh and access token")
        }
}

const registerUser=asyncHandler( async( req, res)=>{
    //get user detail from frontend
    //validation-non empty
    //check is the user exist: username and email
    //check the image of the avatar 
    //upload them on cloudinary, avatar
    //cretae user object-create entry in db
    //remove password and refresh token from response

    const {fullName,email,username,password}=req.body
    console.log("email",email);

    if(
        [fullName,email,username,password].some((field)=>
        field.trim()==="")
    ){
        throw new ApiError(400,"All fields are requried")
    }
    const existedUser=await User.findOne({
        $or: [{username},{email}]
    })
   
    if(existedUser){
        throw new ApiError(409,"User with eamil or username is already exists!")
    }

    const avatarLocalPath=req.files?.avatar?.[0]?.path;
    const coverImageLocalPath=req.files?.coverImage?.[0]?.path;
    console.log(coverImageLocalPath)
    console.log(avatarLocalPath)
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is requried ")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await coverImageLocalPath?uploadOnCloudinary(coverImageLocalPath):null;
    console.log(avatar)
    if(!avatar){
        throw new ApiError(400,"Avatar file is requried ")
    }

    const user =await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200,"User registered Successfully")
    )
})
const loginUser=asyncHandler(async (req,res)=>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email,username,password}=req.body
    console.log(email);

    if(!email && !username){
        throw new ApiError(400,"username or email is requried")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid=user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }
    
    const {accessToken,refreshToken}=await generateAccessAndRefreshTookens(user._id);

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser, accessToken, refreshToken
            },
            "user logged in Sucessfully"
        )
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset:{
                    refreshToken:1 //this removes the field from document 
                }
            },
            {
                new:true
            }
        )
        const options = {
        httpOnly: true,
        secure: true
        }

        return res
        .status(200)
        .clearCookie("accessToken",accessToken,options)
        .clearCookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(200,{},"User Logged Out"))
})
export {
    registerUser,
    loginUser,
    logoutUser
};