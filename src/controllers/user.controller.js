import UserModel from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


const generateAccessAndRefreshToken = async(id) => {
    try {
        const user = await UserModel.findById(id);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};
        
    } catch (error) {
        console.error("Failed to generate access and refresh tokens");
        throw new ApiError(400, "Failed to generate tokens");
    }
}

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

    const avatarLocalPath = req.file?.path;
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

const login = asyncHandler(async(req, res) => {
    const {identifier, password} = req.body;
    
    if(!identifier || !password){
        throw new ApiError(400, "All fields are required");
    }

    // check if the user exists
    const user = await UserModel.findOne({ $or: [{email: identifier}, {username: identifier}] });
    
    // If there exists no user
    if(!user){
        throw new ApiError(400, "User doesn't exist");
    }

    //check if the password is correct
    const isValidPassword = user.isValidPassword(password);

    //If the password is not correct
    if(!isValidPassword){
        throw new ApiError(400, "Invalid credentials");
    }

    // generate access and refresh tokens
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    const loggedInUser = await UserModel.findById(user._id).select("-password -refreshToken");

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, "User login successful", {loggedInUser, refreshToken, accessToken})
    );
})

export {registerUser, login}