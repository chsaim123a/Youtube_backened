import { asyncHandlers } from "../utills/asynchHandlers.js"
import { ApiErrors } from "../utills/ApiErrors.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utills/cloudinary.js"
import { ApiResponse } from "../utills/ApiResponse.js"

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

    const exsistedUser = Users.findOne({
        $or: [{ username }, { email }]
    });

    if (exsistedUser) {
        throw new ApiErrors(409, "User with email or username already exsisted")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    console.log(avatarLocalPath);

    const coverImagelocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiErrors(400, "all files are required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const covrerImage = await uploadOnCloudinary(coverImagelocalPath)

    if (!avatar) {
        throw new ApiErrors(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avtar.url,
        covrerImage: coverImage?.url,
        email,
        password,
        username: username.tolowerCase()
    })

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
})

export { registerUser }