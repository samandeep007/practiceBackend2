import UserModel from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

const verifyJWT = asyncHandler(async(req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(!token){
        throw new ApiError(401, "Unauthorized | Access Prohibited")
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserModel.findById(decodedToken?._id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(400, "Invalid access token");
    }
    req.user = user;
    next();
})

export default verifyJWT;