import { Router } from "express";
import { getStudentDashboard, getTeacherDashboard } from "../controllers/dashboard.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const dashboardRouter = Router();

dashboardRouter.route("/student").get(
    verifyJWT,
    getStudentDashboard
);
dashboardRouter.route("/teacher").get(
    verifyJWT,
    getTeacherDashboard
);

export default dashboardRouter;