import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const {username, fullName, email, password, role, bio} = req.body

    console.log(username, " " ,fullName, " " ,email, " " ,password, " " ,role, " " ,bio);

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    });

    if(existedUser){
        throw new ApiError(409, "User Already Exists");
    };

    const profile_PicLocalPath = req.files?.profile_Pic[0]?.path;

    const profile_Pic = await uploadOnCloudinary(profile_PicLocalPath);

    const user = await User.create({
        username: username.toLowerCase,
        fullName,
        email,
        role,
        bio,
        profile_Pic : profile_Pic?.url || "",
        password
    });

    const createdUser = User.findById(user._id).select(
        "-password -refresh_token"
    );

    if(!createdUser){
        throw new ApiError(500, "User not created")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
})

export default registerUser;