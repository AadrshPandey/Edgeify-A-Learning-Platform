import { Video } from "../models/video.models.js";
import { History } from "../models/history.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addToHistory = asyncHandler(async (req, res) => {
    const user_id = req.user?._id;
    const {video_id} = req.params;

    const video = await Video.findById(video_id);

    if(!video){
        throw new ApiError(400, "Video doesnot exists");
    }

    const isHistoryExists = await History.findOne({
        user_id,
        video_id
    });

    if(isHistoryExists){
        await History.findByIdAndUpdate(
            isHistoryExists._id,
            {}
        );
    }
    else{
        await History.create({
            user_id,
            video_id
        });
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "History Created Successfully"));
});

const getMyHistory = asyncHandler(async (req, res) => {
    const user_id = req.user?._id;

    const history = await History.find({
        user_id
    }).populate("video_id").sort({updatedAt : -1});

    return res
    .status(200)
    .json(new ApiResponse(200, history, "History fetched successfully"));
});

const removeFromHistory = asyncHandler(async (req, res) => {
    const user_id = req.user?._id;
    const { video_id } = req.params;

    const video = await Video.findById(video_id);

    if(!video){
        throw new ApiError(400, "Video does not exists");
    }

    await History.findOneAndDelete({
        user_id,
        video_id
    });

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Removed from history successfullly"));
});

const clearHistory = asyncHandler(async (req, res) => {
    const user_id = req.user?._id;

    await History.deleteMany({
        user_id
    });

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "History cleared successfully"));
});

export {
    addToHistory,
    getMyHistory,
    removeFromHistory,
    clearHistory
};