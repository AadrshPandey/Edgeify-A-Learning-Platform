import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const courseSchema = new Schema(
    {
        description:{
            type: String,
            required: true,
            trim: true
        },
        title:{
            type: String,
            required: true,
            trim: true,
            index: true
        },
        thumbnail:{
            type: String,
            trim: true
        },
        price:{
            type: Number
        },
        level:{
            type: String,
            trim: true
        },
        language:{
            type: String,
            trim: true
        },
        duration:{
            type: String
        },
        teacher_id:{
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        category_id:{
            type: Schema.Types.ObjectId,
            ref:"Category"
        },
        average_rating : {
            type: Number,
            default : 0
        }
    },
    {
        timestamps: true
    }
)

courseSchema.plugin(mongooseAggregatePaginate);

export const Course = mongoose.model("Course", courseSchema);