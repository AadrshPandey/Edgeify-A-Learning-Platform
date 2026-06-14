import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";    
import { Course } from "../models/course.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const { course_id } = req.params;
  const teacher_id = req.user?._id;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  const video_urlLocalPath = req.files?.video_url?.[0]?.path;

  if (req.user?.role === "student") {
    throw new ApiError(403, "Unauthorized Access");
  }

  const course = await Course.findById(course_id);

  if(!course){
    throw new ApiError(404, "Course does not exist");
  }

  if(course.teacher_id.toString() != req.user?._id.toString()){
    throw new ApiError(403, "Unauthorized Access");
  }

  if (
    !title ||
    !description ||
    !duration ||
    !thumbnailLocalPath||
    !video_urlLocalPath
  ) {
    throw new ApiError(404, "All fields are necessary");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const video_url = await uploadOnCloudinary(video_urlLocalPath);

  if (!thumbnail?.url || !video_url?.url) {
    throw new ApiError(400, "Error while uploading on cloudinary");
  }

  const video = await Video.create({
    title,
    description,
    duration,
    course_id,
    teacher_id,
    thumbnail: thumbnail?.url,
    video_url: video_url?.url,
  });

  if (!video) {
    throw new ApiError(400, "Video not uploaded");
  }

  console.log("Video uploaded successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { video_id } = req.params;

  const video = await Video.findById(video_id);

  if (!video) {
    throw new ApiError(404, "No video Exists");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const getVideoByCourseId = asyncHandler(async (req, res) => {
  const { course_id } = req.params;

  const videos = await Video.find({
    course_id: course_id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched Successfully"));
});

const getVideoByTeacherId = asyncHandler(async (req, res) => {
  const teacher_id = req.user?._id;

  const user = await User.findById(teacher_id);

  if (!user) {
    throw new ApiError(404, "Teacher doesnot exists");
  }

  const videos = await Video.find({
    teacher_id: teacher_id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched Successfully"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const { video_id } = req.params;

  const teacher_id = req.user?._id;

  if (!title || !description || !duration) {
    throw new ApiError(404, "All fields are necessary");
  }

  if (req.user?.role === "student") {
    throw new ApiError(403, "Unauthorized Access");
  }

  const video = await Video.findById(video_id);

  if (!video) {
    throw new ApiError(404, "Video doesnot exists");
  }

  if (req.user?._id.toString() != video.teacher_id.toString()) {
    throw new ApiError(403, "Unauthorized Access");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    video_id,
    {
      $set: {
        title,
        description,
        duration,
      },
    },
    {
      returnDocument: "after",
    },
  );

  console.log("Video details updated Successfully");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Video details updated Successfully"),
    );
});

const updateVideoThumbnail = asyncHandler(async (req, res) => {
  const { video_id } = req.params;
  const teacher_id = req.user?._id;
  const thumbnailLocalPath = req.file?.path;

  if (req.user?.role === "student") {
    throw new ApiError(403, "Unauthorized Access");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(404, "Thumbnail doesnot exists");
  }

  const video = await Video.findById(video_id);

  if (!video) {
    throw new ApiError(404, "Video doesnot exists");
  }

  if (req.user?._id.toString() != video.teacher_id.toString()) {
    throw new ApiError(403, "Unauthorized Access");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const updatedVideo = await Video.findByIdAndUpdate(
    video_id,
    {
      $set: {
        thumbnail: thumbnail?.url || "",
      },
    },
    {
      returnDocument: "after",
    },
  );

  console.log("Thumbnail updated Successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Thumbnail updated Successfully"));
});

const updateVideoURL = asyncHandler(async (req, res) => {
  const { video_id } = req.params;
  const teacher_id = req.user?._id;
  const video_urlLocalPath = req.file?.path;

  if (req.user?.role === "student") {
    throw new ApiError(403, "Unauthorized Access");
  }

  if (!video_urlLocalPath) {
    throw new ApiError(404, "Video doesnot exists");
  }

  const video = await Video.findById(video_id);

  if (!video) {
    throw new ApiError(404, "Video doesnot exists");
  }

  if (req.user?._id.toString() != video.teacher_id.toString()) {
    throw new ApiError(403, "Unauthorized Access");
  }

  const video_url = await uploadOnCloudinary(video_urlLocalPath);

  const updatedVideo = await Video.findByIdAndUpdate(
    video_id,
    {
      $set: {
        video_url: video_url?.url || "",
      },
    },
    {
      returnDocument: "after",
    },
  );

  console.log("Video updated Successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated Successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { video_id } = req.params;
  const teacher_id = req.user?._id;

  if (req.user?.role === "student") {
    throw new ApiError(403, "Unauthorized Access");
  }

  const video = await Video.findById(video_id);

  if (!video) {
    throw new ApiError(404, "Video doesnot exists");
  }

  if (req.user?._id.toString() != video.teacher_id.toString()) {
    throw new ApiError(403, "Unauthorized Access");
  }

  await Video.findByIdAndDelete(video_id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video Deleted Successfully"));
});

export {
  uploadVideo,
  getVideoById,
  getVideoByCourseId,
  getVideoByTeacherId,
  updateVideoDetails,
  updateVideoThumbnail,
  updateVideoURL,
  deleteVideo,
};
