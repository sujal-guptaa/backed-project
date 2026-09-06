import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema(
    {
        videoFile:{
            type:String, // cloudinary url
            required:true
        },
        videoPublicID:{
            type:String
        },
        thumbnail:{
            type:String, // cloudinary url
            required:true
        },
        thumbnailPublicID:{
            type:String
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        duration:{
            type:Number,
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required: true
        }
    },
    {
        timestamps:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",videoSchema);