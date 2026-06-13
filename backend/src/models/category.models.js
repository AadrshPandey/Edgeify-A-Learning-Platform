import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema(
    {
        category_name:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },
        description:{
            type: String,
            trim: true,
            required: true
        },
        thumbnail:{
            type: String,
            trim: true
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

export const Category = mongoose.model("Category", categorySchema);