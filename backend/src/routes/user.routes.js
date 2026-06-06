import { Router } from "express";
import {registerUser, loginUser, logoutUser} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { getCurrentUser } from "../controllers/currentUser.controllers.js";

const userRouter = Router();

userRouter.route("/register").post(
    upload.fields([{
        name: "profile_Pic",
        maxCount: 1
    }]),
    registerUser
);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verifyJWT, logoutUser);

userRouter.route("/current-user").get(verifyJWT, getCurrentUser);

export default userRouter;