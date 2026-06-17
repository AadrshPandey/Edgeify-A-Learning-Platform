import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Course } from "../models/course.models.js";
import { Review } from "../models/review.models.js";

const createReview = asyncHandler(async (req, res) => {
    const user_id = req.user?._id;
    const { course_id } = req.params;
    const { rating, review } = req.body;

    const course = await Course.findById(course_id);

    if(!course){
        throw new ApiError(403, "Course doesnot exists");
    }

    if(!rating){
        throw new ApiError(403, 'Rating and review cannot be blank');
    }

    const isReviewed = await Review.findOne({
        user_id,
        course_id
    });

    if(isReviewed){
        throw new ApiError(400, "You have already reviewed this course");
    }

    const newReview = await Review.create({
        user_id,
        course_id,
        rating,
        review : review || ""
    });

    if(!newReview){
        throw new ApiError(400, "Review not created");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, newReview, "Review created successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
    const {review, rating} = req.body;
    const {review_id} = req.params;
    const user_id = req.user?._id;

    const myReview = await Review.findById(review_id);

    if(!myReview){
        throw new ApiError(400, "No review Exists");
    }

    if(!rating){
        throw new ApiError(400, "Feilds cannot be left blank");
    }

    if(myReview.user_id.toString() != user_id.toString()){
        throw new ApiError(400, "Unauthorized access");
    }

    const updatedReview = await Review.findByIdAndUpdate(
        review_id,
        {
            $set: {
                review : review || "",
                rating
            }
        },
        {
            returnDocument: "after"
        }
    );

    if(!updatedReview){
        throw new ApiError(400, "Review doesnot updated");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedReview, "Review Updated Successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
    const {review_id} = req.params;
    const user_id = req.user?._id;

    const myReview = await Review.findById(review_id);

    if(!myReview){
        throw new ApiError(400, "No review Exists");
    }

    if(myReview.user_id.toString() != user_id.toString()){
        throw new ApiError(400, "Unauthorized access");
    }

    await Review.findByIdAndDelete(review_id);

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully"));
});

const getReviewsOfCourse = asyncHandler(async (req, res) => {
    const { course_id } = req.params;

    const course = await Course.findById(course_id);

    if(!course) {
        throw new ApiError(400, "Course doesnot exists");
    }

    const allReviews = await Review.find({
        course_id
    }).populate("user_id");

    return res
    .status(200)
    .json(new ApiResponse(200, allReviews, "Reviews fetched successfully"));
});

const getMyReview = asyncHandler(async (req, res) => {
    const user_id = req.user?._id;
    const { course_id } = req.params;

    const course = await Course.findById(course_id);

    if(!course) {
        throw new ApiError(400, "Course doesnot exists");
    }

    const review = await Review.findOne({
        user_id,
        course_id
    });

    if(!review){
        throw new ApiError(400, "Review cannot be fetched");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, review, "Review fetched successfully"));
});

export {
    createReview,
    updateReview,
    deleteReview,
    getReviewsOfCourse,
    getMyReview
};