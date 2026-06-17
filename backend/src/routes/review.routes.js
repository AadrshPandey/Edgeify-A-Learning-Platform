import { Router } from "express";
import { 
    createReview,
    updateReview,
    deleteReview,
    getReviewsOfCourse,
    getMyReview
} from "../controllers/review.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const reviewRouter = Router();

reviewRouter.route("/create/:course_id").post(
    verifyJWT,
    createReview
);

reviewRouter.route("/update/:review_id").patch(
    verifyJWT,
    updateReview
);

reviewRouter.route("/allReviews/:course_id").get(
    getReviewsOfCourse
);

reviewRouter.route("/myReview/:course_id").get(
    verifyJWT,
    getMyReview
);

reviewRouter.route("/delete/:review_id").delete(
    verifyJWT,
    deleteReview
);

export default reviewRouter;