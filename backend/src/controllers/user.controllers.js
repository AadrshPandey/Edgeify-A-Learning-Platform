import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

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

  console.log(req.files);

  let profile_PicLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.profile_Pic) &&
    req.files.profile_Pic.length > 0
  ) {
    profile_PicLocalPath = req.files.profile_Pic[0].path;
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

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  console.log("User LoggedIn Succeessfully");

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
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

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  console.log("User logged out successfully Backend");

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged out successfully frontend"));
});

export { registerUser, loginUser, logoutUser };
