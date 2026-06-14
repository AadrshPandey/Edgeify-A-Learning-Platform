import { Router } from "express";
import {
  uploadVideo,
  getVideoById,
  getVideoByCourseId,
  getVideoByTeacherId,
  updateVideoDetails,
  updateVideoThumbnail,
  updateVideoURL,
  deleteVideo,
} from "../controllers/video.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const videoRouter = Router();

videoRouter.route("/teacher/my-videos")
.get(
  verifyJWT,
  getVideoByTeacherId
);

videoRouter.route("/course/:course_id")
.get(
  getVideoByCourseId
);

videoRouter.route("/:video_id")
.get(
  getVideoById
);

videoRouter.route("/upload/:course_id")
.post(
  verifyJWT,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "video_url",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

videoRouter.route("/update-details/:video_id")
.patch(
  verifyJWT,
  updateVideoDetails
);

videoRouter.route("/update-thumbnail/:video_id")
.patch(
  verifyJWT,
  upload.single("thumbnail"),
  updateVideoThumbnail
);

videoRouter.route("/update-video/:video_id")
.patch(
  verifyJWT,
  upload.single("video_url"),
  updateVideoURL
);

videoRouter.route("/delete/:video_id")
.delete(
  verifyJWT,
  deleteVideo
);

export default videoRouter;