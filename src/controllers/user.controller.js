import UserModel from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const registerUser = asyncHandler(async(req, res) => {
    const{fullName, email, username, password} = req.body;
    
    // Validate fields
    if([fullName, email, username, password].some(field => !field)){
        throw new ApiError(400, "All fields are required");
    }

    // Check for existing user
    const isExistingUser = await UserModel.findOne({
        $or: [{email}, {username}]
    })

    if(isExistingUser){
        throw new ApiError(400, "User Already Exists")
    }

    const avatarLocalPath = req.file.path;
    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;

    const newUser = await UserModel.create({
        fullName: fullName,
        email: email,
        username: username,
        password: password,
        avatar: avatar?.url || `https://ui-avatars.com/api/?name=${fullName.split(" ").join("+")}`
    })

    const registeredUser = await UserModel.findById(newUser._id).select("-password -refreshToken");
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, "User registered successfully!", registerUser)
    )

})

