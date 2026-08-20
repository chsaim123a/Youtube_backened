import { asyncHandlers } from "../utills/asynchHandlers.js"
import { ApiErrors } from "../utills/ApiErrors.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utills/cloudinary.js"
import { ApiResponse } from "../utills/ApiResponse.js"


const gernateAccessAndRefreshToken = async (userId) => {
    try {
        const user = User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw new ApiErrors(500, "something went wrong while gernating acces and refreshh token")
    }
}
const registerUser = asyncHandlers(async (req, res) => {
    // get user details from frontened
    // validation 
    // check if already exsist : username , email
    // check for images, or avatar
    // upload them to cloudinary, avatar
    // create user objects - create entery in db
    // remove password or refresh token fom respponse
    // check for user creation 
    // retuen response

    const { fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some((field) => field.trim() === "")
    ) {
        throw new ApiErrors(400, "All fields are required")
    }

    const exsistedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (exsistedUser) {
        throw new ApiErrors(409, "User with email or username already exsisted")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!coverImageLocalPath) {
        throw new ApiErrors(400, "all files are required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiErrors(400, "Avatar is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createUser) {
        throw new ApiErrors(500, "something went wrong while creating user")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200, createUser, "User register successfully"
            )
        )
});

const loginUser = asyncHandlers(async (req, res) => {
    // req-body -> data
    // username and email
    // find the user
    // password check
    // access and refresh token
    // send cokkie
    // response

    const { email, password, username } = req.body

    if (!(username || email)) {
        throw new ApiErrors(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiErrors(400, "user does not exsist")
    }

    const isPasswordValid = await user.isPasswordCorrected(password)

    if (!isPasswordValid) {
        throw new ApiErrors(401, "invalid user password")
    }

    const { accessToken, refreshToken } = await gernateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly = true,
        secure = true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refrehToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessTOken, refreshToken
                },
                "User looged in successfuly"
            )
        )


});

const logOutUser = asyncHandlers(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        }, {
        new: true
    }
    )

    const options = {
        httpOnly = true,
        secure = true
    }

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User logged out successfuly"))
})

export { registerUser, loginUser, logOutUser }