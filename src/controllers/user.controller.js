import { asyncHandlers } from "../utills/asynchHandlers.js"

const registerUser = asyncHandlers(async(req,res) => {
    res.status(200).json({
        message: "shut up"
    })
})

export { registerUser }