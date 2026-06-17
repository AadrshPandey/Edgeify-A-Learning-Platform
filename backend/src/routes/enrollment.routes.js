import { Router } from "express";
import {
  createEnrollment,
  getMyEnrollments,
  isEnrolled,
  getStudentsOfCourse,
} from "../controllers/enrollment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const enrollmentRouter = Router();

enrollmentRouter.route("/enroll/:course_id").post(verifyJWT, createEnrollment);

enrollmentRouter.route("/my-enrollments").get(verifyJWT, getMyEnrollments);

enrollmentRouter.route("/is-enrolled/:course_id").get(verifyJWT, isEnrolled);

enrollmentRouter
  .route("/students/:course_id")
  .get(verifyJWT, getStudentsOfCourse);

export default enrollmentRouter;