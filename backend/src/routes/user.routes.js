import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, changeCurrentPassword, updateAccountDetails, updateProfilePic} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
    upload.single("profile_Pic"),
    registerUser
);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/change-password").patch(verifyJWT, changeCurrentPassword);
userRouter.route("/profile").patch(verifyJWT, updateAccountDetails);
userRouter.route("/change-profilePic").patch(
    verifyJWT,
    upload.single("profile_Pic"),
    updateProfilePic
);

export default userRouter;  