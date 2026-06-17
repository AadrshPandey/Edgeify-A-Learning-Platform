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
        }
    },
    {
        timestamps: true
    }
)

export const History = mongoose.model("History", historySchema);