import mongoose, { Schema } from "mongoose";

const progressSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    video_id: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Progress = mongoose.model("Progress", progressSchema);
