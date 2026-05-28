import mongoose, {Schema} from "mongoose";

const historySchema = new Schema(
    {
        user_id:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        video_id:{
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        duration:{
            type: Number
        },
        is_completed:{
            type: Boolean
        }
    },
    {
        timestamps: true
    }
)

export const History = mongoose.model("History", historySchema);