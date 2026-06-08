import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { cookieOptions } from "../constants.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (user_id) => {
  try {
    const user = await User.findById(user_id);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error While generating Access and Refersh Token...");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password, role, bio } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    console.log("User Already Exists");
    console.log(username, " ", fullName, " ", email, " ", role, " ", bio, " ");
    throw new ApiError(409, "User Already Exists");
  }
  console.log("User Registration Processing...");
  console.log(username, " ", fullName, " ", email, " ", role, " ", bio, " ");

  console.log(req.file);

  let profile_PicLocalPath;

  if (
    req.file
  ) {
    profile_PicLocalPath = req.file.path;
  }

  const profile_Pic = await uploadOnCloudinary(profile_PicLocalPath);

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    email,
    role,
    bio,
    profile_Pic: profile_Pic?.url || "",
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refresh_token",
  );

  if (!createdUser) {
    throw new ApiError(500, "User not created");
  }
  console.log("User Registered Successfully");
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username or Password connot be blank");
  }

  const user = await User.findOne({ username });

  if (!user) {
    console.log("User Doesnot exists");
    throw new ApiError(404, "User doesnot exists...");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    // console.log("Invalid Password");
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  console.log("User LoggedIn Succeessfully");

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, loggedInUser, "User LoggedIn Succeessfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      returnDocument: "after",
    },
  );

  console.log("User logged out successfully Backend");

  return res
  .status(200)
  .clearCookie("accessToken", cookieOptions)
  .clearCookie("refreshToken", cookieOptions)
  .json(new ApiResponse(200, {}, "User logged out successfully frontend"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try{
    const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "RefreshToken is expired");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(new ApiResponse(200, { accessToken }, "Access token refreshed successfully"));
  }catch(error){
    console.log("Error while refreshing access token...");
    throw new ApiError(500, "Error while refreshing access token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const {oldPassword, newPassword} = req.body;

  const user = await User.findById(req.user._id);

  if(!user){
    throw new ApiError(400, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if(!isPasswordCorrect){
    throw new ApiError(400, "Incorrect Password");
  }

  user.password = newPassword;

  await user.save({validateBeforeSave: false});

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Password Changed Successfully"));

});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
    .json( new ApiResponse(200, req.user, "Current User Fetched"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const {fullName, email, bio} = req.body;

  if(!fullName || !email){
    throw new ApiError(400, "Name or Email cannot be empty");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email,
        bio
      }
    },
    {
      returnDocument : "after"
    }
  );

  return res
  .status(200)
  .json(new ApiResponse(200, user, "Account updated Successfully"));
});

const updateProfilePic = asyncHandler(async (req, res) => {
  console.log(req.file);

  let profile_PicLocalPath;

  if (req.file) {
    profile_PicLocalPath = req.file.path;
  }
  else{
    throw new ApiError(400, "Profile picture is required");
  }

  const profile_Pic = await uploadOnCloudinary(profile_PicLocalPath);

  if(!profile_Pic?.url){
    throw new ApiError(400, "error while uploading on cloudinary");
  }

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        profile_Pic : profile_Pic.url
      }
    },
    {
      returnDocument: "after"
    }
  ).select("-password ");

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Photo updated Successfully"));
});

export { 
        registerUser, loginUser, 
        logoutUser, refreshAccessToken, 
        changeCurrentPassword, getCurrentUser, 
        updateAccountDetails, updateProfilePic
      };
