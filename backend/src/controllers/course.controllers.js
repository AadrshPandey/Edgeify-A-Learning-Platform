import { Course } from "../models/course.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { Category } from "../models/category.models.js";
import { Enrollment } from "../models/enrollment.models.js";

const createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, level, language, duration } = req.body;
  const { category_id } = req.params;
  const thumbnailLocalPath = req.file?.path;
  const teacher_id = req.user?._id;

  console.log({
    title,
    description,
    price,
    level,
    language,
    duration
});

  if(req.user?.role === "student"){
    throw new ApiError(403, "Unauthorized Access");
  }

  if (!title || !description || price === undefined || !level || !language || duration === undefined) {
    throw new ApiError(400, "All feilds are required");
  }

  console.log("Course creation Processing...");

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const course = await Course.create({
    title,
    description,
    price,
    level,
    language,
    duration,
    teacher_id,
    category_id,
    thumbnail: thumbnail?.url || "",
  });

  if (!course) {
    throw new ApiError(400, "Course not Created");
  }

  console.log("Course created Completed");

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course Created Successfully"));
});

const getCourseById = asyncHandler(async (req, res) => {
  const { course_id } = req.params;

  const course = await Course.findById(course_id);

  if (!course) {
    throw new ApiError(400, "Error while fetching the course");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course fetched Successfully"));
});

const getCoursesOfSameCategory = asyncHandler(async (req, res) => {
  const { category_id } = req.params;

  const category = await Category.findById(category_id);

  if (!category) {
    throw new ApiError(400, "Category Doesnot Exist");
  }

  const courses = await Course.find({
    category_id: category_id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses Fetched Successfully"));
});

const getCoursesOfSameTeacher = asyncHandler(async (req, res) => {
  const teacher_id = req.user?._id;

  const courses = await Course.find({
    teacher_id: teacher_id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses Fetched Successfully"));
});

const updateCourseDetails = asyncHandler(async (req, res) => {
  const { course_id } = req.params;
  const { title, description, price, level, language, duration } = req.body;
  const teacher_id = req.user?._id;

  if (!title || !description || price === undefined || !level || !language || duration === undefined) {
    throw new ApiError(400, "All feilds are required");
  }

  const course = await Course.findById(course_id);

  if (!course) {
    throw new ApiError(404, "Course does not exist");
  }

  if (course.teacher_id.toString() != teacher_id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    course_id,
    {
      $set: {
        title,
        description,
        price,
        level,
        language,
        duration,
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
        updatedCourse,
        "Course Details Updated Successfully",
      ),
    );
});

const updateCourseThumbnail = asyncHandler(async (req, res) => {
  const thumbnailLocalPath = req.file?.path;
  const { course_id } = req.params;
  const teacher_id = req.user?._id;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const course = await Course.findById(course_id);

  if (!course) {
    throw new ApiError(404, "Course does not exist");
  }

  if (course.teacher_id.toString() != teacher_id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail?.url) {
    throw new ApiError(400, "Error while uploading on Cloudinary");
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    course_id,
    {
      $set: {
        thumbnail: thumbnail.url,
      },
    },
    {
      returnDocument: "after",
    },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCourse, "Thumbnail Uploaded Successfully"),
    );
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { course_id } = req.params;
  const teacher_id = req.user?._id;

  const course = await Course.findById(course_id);

  if (!course) {
    throw new ApiError(404, "Course does not exist");
  }

  if (course.teacher_id.toString() != teacher_id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  await Course.findByIdAndDelete(course_id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Course Deleted Successfully"));
});

const searchCourses = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if(!query){
    throw new ApiError(400, "Query is required");
  }

  const courses = await Course.find({
    $or : [
      {
        title : {
          $regex : query,
          $options : "i"
        }
      },
      {
        description : {
          $regex : query,
          $options : "i"
        }
      }
    ]
  }).populate("teacher_id category_id");

  return res
  .status(200)
  .json(new ApiResponse(200, courses, "Courses fetched successfully"));
});

const getPopularCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.aggregate([
    {
      $group : {
        _id : "$course_id",
        noOfStudents : {
          $sum : 1
        }
      }
    },
    {
      $sort : {
        noOfStudents : -1
      }
    }
  ]);

  const courseIDs = enrollments.map((course) => course._id);

  const courses = await Course.find({
    _id : {
      $in : courseIDs
    }
  });

  const courseMap = {};

  courses.forEach((course) => {
    courseMap[course._id.toString()] = course;
  })

  const popularCourse = enrollments.map((enrollment) => ({
    course : courseMap[enrollment._id.toString()],
    noOfStudents : enrollment.noOfStudents
  }));

  return res
  .status(200)
  .json(new ApiResponse(200, popularCourse, "Popular Courses fetched successfully"));
});

export {
  createCourse,
  getCourseById,
  getCoursesOfSameCategory,
  getCoursesOfSameTeacher,
  updateCourseDetails,
  updateCourseThumbnail,
  deleteCourse,
  searchCourses,
  getPopularCourses
};
