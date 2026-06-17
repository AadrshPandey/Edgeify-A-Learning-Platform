import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema(
    {
        user_id:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        course_id:{
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        rating:{
            type: Number,
            required: true
        },
        review:{
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
)

export const Review = mongoose.model("Review", reviewSchema);