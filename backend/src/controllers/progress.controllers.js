import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Progress } from "../models/progress.models.js";
import { Video } from "../models/video.models.js";
import { Enrollment } from "../models/enrollment.models.js";

const markAsComplete = asyncHandler(async (req, res) => {
  const user_id = req.user?._id;
  const { video_id } = req.params;

  const video = await Video.findById(video_id);
  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  const course_id = video.course_id;
  const enrollment = await Enrollment.findOne({ course_id, user_id });

  if (!enrollment) {
    throw new ApiError(403, "Enroll in course first");
  }

  const existingProgress = await Progress.findOne({
    user_id,
    video_id,
  });

  if (existingProgress?.isCompleted === true) {
    throw new ApiError(400, "Video already completed");
  }

  if (existingProgress) {
    existingProgress.isCompleted = true;
    await existingProgress.save();
  } else {
    await Progress.create({
      user_id,
      video_id,
      isCompleted: true,
    });
  }

  const courseVideos = await Video.find({
    course_id,
  });

  const videoIDs = courseVideos.map((video) => video._id);

  const completedVideosCount = await Progress.countDocuments({
    user_id,
    video_id: {
      $in: videoIDs,
    },
    isCompleted: true,
  });

  const progress_percentage =
    videoIDs.length === 0
      ? 0
      : Math.round((completedVideosCount / videoIDs.length) * 100);

  const updatedEnrollment = await Enrollment.findByIdAndUpdate(
    enrollment._id,
    {
      $set: {
        progress_percentage,
      },
    },
    {
      returnDocument: "after",
    },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedEnrollment,
        "Video marked as completed Successfully",
      ),
    );
});

const markAsInComplete = asyncHandler(async (req, res) => {
  const user_id = req.user?._id;
  const { video_id } = req.params;

  const video = await Video.findById(video_id);
  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  const course_id = video.course_id;
  const enrollment = await Enrollment.findOne({ course_id, user_id });

  if (!enrollment) {
    throw new ApiError(403, "Enroll in course first");
  }

  const existingProgress = await Progress.findOne({
    user_id,
    video_id,
  });

  if (!existingProgress) {
    throw new ApiError(400, "Video has never been marked as completed");
  }

  if (!existingProgress?.isCompleted) {
    throw new ApiError(400, "Video already marked as in completed");
  }

  existingProgress.isCompleted = false;
  await existingProgress.save();

  const courseVideos = await Video.find({
    course_id,
  });

  const videoIDs = courseVideos.map((video) => video._id);

  const completedVideosCount = await Progress.countDocuments({
    user_id,
    video_id: {
      $in: videoIDs,
    },
    isCompleted: true,
  });

  const progress_percentage =
    videoIDs.length === 0
      ? 0
      : Math.round((completedVideosCount / videoIDs.length) * 100);

  const updatedEnrollment = await Enrollment.findByIdAndUpdate(
    enrollment._id,
    {
      $set: {
        progress_percentage,
      },
    },
    {
      returnDocument: "after",
    },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedEnrollment,
        "Video marked as incomplete successfully",
      ),
    );
});

const getCompletedVideos = asyncHandler(async (req, res) => {
  const user_id = req.user?._id;

  const completedVideos = await Progress.find({
    user_id,
    isCompleted: true,
  }).populate("video_id");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        completedVideos,
        "Completed videos fetched successfully",
      ),
    );
});

export {
    markAsComplete,
    markAsInComplete,
    getCompletedVideos
};
