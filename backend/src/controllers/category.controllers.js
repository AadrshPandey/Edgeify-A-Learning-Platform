import { Category } from "../models/category.models.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const createCategroy = asyncHandler(async (req, res) => {
  const { category_name, description } = req.body;
  const thumbnailLocalPath = req.file?.path;
  const user_id = req.user?._id;

  const user = await User.findById(user_id);

  if (!user) {
    throw new ApiError(403, "Unauthorized Access");
  }

  if (user.role === "student") {
    throw new ApiError(403, "Unauthorized Access");
  }

  if (!category_name || !description) {
    throw new ApiError(400, "All feilds are required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const category = await Category.create({
    category_name,
    description,
    thumbnail: thumbnail?.url || "",
    user_id,
  });

  if (!category) {
    throw new ApiError(400, "Category not Created");
  }

  console.log("Category created Completed");

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category Created Successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories Fetched Successfully"));
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { category_id } = req.params;

  const category = await Category.findById(category_id);

  if (!category) {
    throw new ApiError(400, "Categroy Doesnot Exist");
  }

  console.log("Categroy Fetched Successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Categroy Fetched Successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { category_id } = req.params;
  const user_id = req.user?._id;

  const user = await User.findById(user_id);

  if (!user) {
    throw new ApiError(403, "Unauthorized Access");
  }

  if (user.role === "student") {
    throw new ApiError(403, "Unauthorized Access");
  }

  const category = await Category.findById(category_id);

  if (!category) {
    throw new ApiError(404, "Category does not exist");
  }

  if (category.user_id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  await Category.findByIdAndDelete(category_id);

  console.log("Category Deleted Successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category Deleted Successfully"));
});

const updateCategoryDetails = asyncHandler(async (req, res) => {
  const { category_name, description } = req.body;
  const user_id = req.user?._id;
  const { category_id } = req.params;

  const category = await Category.findById(category_id);

  if (!category) {
    throw new ApiError(400, "Categroy Doesnot Exist");
  }

  const user = await User.findById(user_id);

  if (!user) {
    throw new ApiError(403, "Unauthorized Access");
  }

  if (user.role === "student") {
    throw new ApiError(403, "Unauthorized Access");
  }

  if (category.user_id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    category_id,
    {
      $set: {
        category_name,
        description,
      },
    },
    {
      returnDocument: "after",
    },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category Updated Successfully"),
    );
});

const updateCategoryThumbnail = asyncHandler(async (req, res) => {
  const thumbnailLocalPath = req.file?.path;
  const { category_id } = req.params;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnial Required");
  }

  if (req.user.role === "student") {
    throw new ApiError(403, "Unauthorized Access");
  }

  const category = await Category.findById(category_id);

  if (!category) {
    throw new ApiError(404, "Categroy Doesnot Exist");
  }

  if (category.user_id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail?.url) {
    throw new ApiError(400, "Unable to Upload on cloudinary");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    category_id,
    {
      $set: {
        thumbnail: thumbnail?.url || "",
      },
    },
    {
      returnDocument: "after",
    },
  );

  console.log("Thumbnail Updated Successfully");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Thumbnail Updated Successfully"),
    );
});

export {
  createCategroy,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  updateCategoryDetails,
  updateCategoryThumbnail,
};
