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
        video_url:{
            type: String
        },
        thumbnail:{
            type: String
        },
        duration:{
            type: String
        },
        course_id:{
            type: Schema.Types.ObjectId,
            ref: "Course"
        },
        teacher_id : {
            type: Schema.Types.ObjectId,
            ref : "User"
        }
    },
    {
        timestamps: true
    }
)

export const Video = mongoose.model("Video", videoSchema);