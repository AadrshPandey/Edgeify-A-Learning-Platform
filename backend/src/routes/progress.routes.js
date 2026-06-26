import { Router } from "express";
import {
  markAsComplete,
  markAsInComplete,
  getCompletedVideos,
} from "../controllers/progress.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const progressRouter = Router();
console.log("Progress router is running");

progressRouter
  .route("/complete/:video_id")
  .patch(verifyJWT, markAsComplete);

progressRouter
  .route("/incomplete/:video_id")
  .patch(verifyJWT, markAsInComplete);

progressRouter
  .route("/completed-videos")
  .get(verifyJWT, getCompletedVideos);

export default progressRouter;