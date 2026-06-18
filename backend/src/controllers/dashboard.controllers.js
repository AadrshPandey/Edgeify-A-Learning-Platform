import { Course } from "../models/course.models.js";
import { Enrollment } from "../models/enrollment.models.js";
import { Video } from "../models/video.models.js";
import { Review } from "../models/review.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Progress } from "../models/progress.models.js";
import { History } from "../models/history.models.js";

const getTeacherDashboard = asyncHandler(async (req, res) => {
  const teacher_id = req.user?._id;

  const courses = await Course.find({
    teacher_id,
  });

  const courseIDs = courses.map((course) => course._id);

  const totalCourses = courseIDs.length;

  const totalVideos = await Video.countDocuments({
    course_id: {
      $in: courseIDs,
    },
  });

  const totalStudents = await Enrollment.countDocuments({
    course_id: {
      $in: courseIDs,
    },
  });

  const reviews = await Review.find({
    course_id: {
      $in: courseIDs,
    },
  });

  const totalReviews = reviews.length;

  let totalRating = 0;

  for (const review of reviews) {
    totalRating += review.rating;
  }

  const averageRating =
    totalReviews === 0 ? 0 : (totalRating / totalReviews).toFixed(1);

  const dashboard = {
    totalCourses,
    totalVideos,
    totalStudents,
    averageRating,
    totalReviews,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, dashboard, "Teacher Dashboard fetched successfully"),
    );
});

const getStudentDashboard = asyncHandler(async (req, res) => {
  const user_id = req.user?._id;

  const enrolledCourses = await Enrollment.countDocuments({
    user_id,
  });

  const completedVideos = await Progress.countDocuments({
    user_id,
    isCompleted: true,
  });

  const enrollments = await Enrollment.find({
    user_id,
  });

  let totalProgress = 0;
  if (enrollments.length > 0) {
    for (const enrollment of enrollments) {
      totalProgress += enrollment.progress_percentage;
    }
  }

  const averageProgress =
    enrollments.length === 0
      ? 0
      : Math.round(totalProgress / enrollments.length);

  const recentHistory = await History.find({
    user_id,
  })
    .populate("video_id")
    .sort({ updatedAt: -1 })
    .limit(10);

    const dashboard = {
        enrolledCourses,
        completedVideos,
        recentHistory,
        averageProgress
    };

    return res
    .status(200)
    .json(new ApiResponse(200, dashboard, "Student dashboard fetched successfully"));
});

export {
    getTeacherDashboard,
    getStudentDashboard
};