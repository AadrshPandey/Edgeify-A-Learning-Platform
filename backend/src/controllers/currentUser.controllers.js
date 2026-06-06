import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
    .json( new ApiResponse(200, req.user, "Current User Fetched"));
});

export { getCurrentUser };