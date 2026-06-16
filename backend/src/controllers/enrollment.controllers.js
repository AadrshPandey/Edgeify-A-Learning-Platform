import { Enrollment } from "../models/enrollment.models.js";
import { Course } from "../models/course.models.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createEnrollment = asyncHandler(async (req, res) => {
  const { course_id } = req.params;
  const user_id = req.user?._id;

  const course = await Course.findById(course_id);

  if (!course) {
    throw new ApiError(404, "Course doesnot exists");
  }

  const isEnrolled = await Enrollment.findOne({
    user_id,
    course_id,
  });

  if (isEnrolled) {
    throw new ApiError(409, "User is already enrolled");
  }

  const enrollment = await Enrollment.create({
    user_id,
    course_id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, enrollment, "User enrolled successfully"));
});

const getMyEnrollments = asyncHandler(async (req, res) => {
  const user_id = req.user._id;

  const enrollments = await Enrollment.find({
    user_id,
  }).populate("course_id");

  const courses = enrollments.map((enrollments) => enrollments.course_id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, courses, "Enrolled Courses fetched successfully"),
    );
});

const isEnrolled = asyncHandler(async (req, res) => {
  const { course_id } = req.params;
  const user_id = req.user?._id;

  const checkEnrolled = await Enrollment.findOne({
    course_id,
    user_id,
  });

  if (!checkEnrolled) {
    throw new ApiError(400, "User is not enrolled in this course");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, checkEnrolled, "User is Enrolled"));
});

const getStudentsOfCourse = asyncHandler(async (req, res) => {
  const { course_id } = req.params;
  const user_id = req.user?._id;

  const course = await Course.findById(course_id);

  if (!course) {
    throw new ApiError(404, "Course does not exist");
  }

  const enrollments = await Enrollment.find({
    course_id,
  }).populate("user_id");

  const students = enrollments.map(
    enrollments => enrollments.user_id
  );

  return res
  .status(200)
  .json(new ApiResponse(200, students, "Students fetched Successfully"));
});
