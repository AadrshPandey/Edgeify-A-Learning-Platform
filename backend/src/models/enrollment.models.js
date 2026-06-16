import mongoose, {Schema} from "mongoose";

const enrollmentSchema = new Schema(
    {
        user_id:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        course_id:{
            type: Schema.Types.ObjectId,
            ref: "Course"
        },
        progress_percentage:{
            type: Number,
            default : 0
        }
    },
    {
        timestamps: true
    }
)

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);