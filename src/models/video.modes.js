import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema(
    {
        videoFile:{
            type:String, // cloudinary url
            requried:true
        },
        thumbnail:{
            type:String, // cloudinary url
            requried:true
        },
        title:{
            type:String,
            requried:true
        },
        description:{
            type:String,
            requried:true
        },
        duration:{
            type:Number,
            requried:true
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
            ref:"User"
        }
    },
    {
        timestamps:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",videoSchema);