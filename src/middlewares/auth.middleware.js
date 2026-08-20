import { User } from "../models/user.model";
import { ApiErrors } from "../utills/ApiErrors";
import { asyncHandlers } from "../utills/asynchHandlers";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandlers(async(req,res,next) => {
   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
 
     if(!token){
         throw new ApiErrors(401, "Unauthorized reques")
     }
 
     const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
     const user =await User.findById(decodeToken?._id).sselect("-password -refreshToken")
 
     if(!user) {
         throw new ApiErrors(401, "invalid token access")
     }
 
     req.user = user
     
     next()
   } catch (error) {
    throw new ApiErrors(401, error?.message || "invalid access token")
   }

})