import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true,
            index: true
        },
        description:{
            type: String,
            trim: true
        },
        url:{
            type: String
        },
        thumbnail:{
            type: String
        },
        duration:{
            type: Number
        },
        course_id:{
            type: Schema.Types.ObjectId,
            ref: "Course"
        }
    },
    {
        timestamps: true
    }
)

export const Video = mongoose.model("Video", videoSchema);