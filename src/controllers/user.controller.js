import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
        field.trim()="")
    ){
        throw new ApiError(400,"All fields are requried")
    }
    const existedUser=User.findOne({
        $or: [{username},{email}]
    })
   
    if(existedUser){
        throw new ApiError(409,"User with eamil or username is already exists!")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0].path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is requried ")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

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

export default registerUser;