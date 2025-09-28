import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiRespose.js"
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new apiError(500, "Error generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res, next) => {
    // res.status(200).json(
    //     {message: "ok"}
    // )

    const { fullname, username, email, password } = req.body;
    console.log("email", email)

    // if(fullname === ""){
    //     throw new apiError(400, "fullname is required")
    // }

    if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        throw new apiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }


    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required")

    }

    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImage = await uploadToCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new apiError(500, "Error uploading avatar image")

    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id)

})

const loginUser = asyncHandler(async (req, res, next) => {
    //req body -> data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie

    const { username, email, password } = req.body;
    if (!username && !email) {
        throw new apiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]//$or is a mongo operator and it takes an array of conditions to match inside the array we pass the objects with the fields to match
    })

    if (!user) {
        throw new apiError(404, "User not found")
    }

    const isPasswordValid = await user.isCorrectPassword(password)

    if (!isPasswordValid) {
        throw new apiError(401, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken ")

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
            new apiResponse(200, "Login successful", { user: loggedInUser, accessToken })
        )
});

const loggedOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const cookieOptions = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new apiResponse(200, {}, "User logged Out"))
})

const refreshAceessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new apiError(401, "Invalide refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "Refresh token expired and use")
        }

        const cookieOptions = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(
                new apiResponse(
                    200,
                    { accessToken, newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new apiError(402,error?.message || "Invalid refresh token")
    }
})


export { registerUser, loginUser, loggedOutUser, refreshAceessToken };










//Get the user details from frontend
//validation not empty
//check if user already exists: username or email
//check for avatar and cover image
//upload to cloudinary
//create user object-create entry in db
//remove password and refresh token from response
//check for user creation
//return result