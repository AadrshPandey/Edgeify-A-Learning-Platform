import { Review } from "../models/review.models.js";
import { Course } from "../models/course.models.js";

const updateAverageRating = async (course_id) => {
  const reviews = await Review.find({ course_id });

  const avg = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  await Course.findByIdAndUpdate(course_id, {
    average_rating: Math.round(avg * 10) / 10
  });
};

export default updateAverageRating;