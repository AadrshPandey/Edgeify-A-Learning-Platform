import { Router } from "express";
import {
    createCourse, getCourseById,
    getCoursesOfSameCategory, getCoursesOfSameTeacher,
    updateCourseDetails, updateCourseThumbnail,
    deleteCourse, searchCourses,
    getPopularCourses
} from "../controllers/course.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const courseRouter = Router();

courseRouter.route("/search").get(searchCourses);
courseRouter.route("/popular").get(getPopularCourses);
courseRouter.route("/teacher/my-courses").get(verifyJWT, getCoursesOfSameTeacher);
courseRouter.route("/category/:category_id").get(getCoursesOfSameCategory);
courseRouter.route("/update-details/:course_id").patch(verifyJWT, updateCourseDetails);
courseRouter.route("/create/:category_id")
.post(
    verifyJWT,
    upload.single("thumbnail"),
    createCourse
);
courseRouter.route("/update-thumbnail/:course_id")
.patch(
    verifyJWT,
    upload.single("thumbnail"),
    updateCourseThumbnail
);
courseRouter.route("/delete/:course_id").delete(verifyJWT, deleteCourse);
courseRouter.route("/:course_id").get(getCourseById);


export default courseRouter;