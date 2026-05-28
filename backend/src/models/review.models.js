import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema(
    {
        user_id:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        course_id:{
            type: Schema.Types.ObjectId,
            ref: "Course"
        },
        rating:{
            type: Number
        },
        comment:{
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
)

export const Review = mongoose.model("Review", reviewSchema);