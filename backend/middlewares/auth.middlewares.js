import jwt from "jsonwebtoken";
import 'dotenv/config'
import User from "../models/user.models.js";
import asyncHandler from "express-async-handler";
import { createError } from "../utils/createError.js";
// import {createProxyMiddleware} from "http-proxy-middleware"

 const JWT_SECRET = process.env.JWT_SECRET;

 export const protect = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    console.log(token)
    if(!token) createError("Unauthorized, no token provided")
    const decoded = jwt.verify(token,JWT_SECRET);
    if(!decoded) createError("Unauthorized , invalid token")
    const user = await User.findById(decoded.userId).select("-password -refreshToken -refreshTokenExpiresAt");
    if(!user) createError("User not found", 404)
    req.user = user;
    next()
  } catch (error) {
    console.error("error in protect middleware", error);
    next(error)
  }
 });


 export const verifyEmailToken = async(req, res, next) => {
  try {
    const {token} = req.query;
    if(!token) createError("Unauthorized, no token provided", 401)
      const decoded = jwt.verify(token, JWT_SECRET)
    if(!decoded) createError("Unauthorized , invalid token", 401)
      const user = await User.findById(decoded.userId).select("-password");
    if(!user) createError("User not found", 404)
      req.user = user;
    next()
  } catch (error) {
    console.error("error in verifyEmailToken middleware")
    next(error)
  }
 }

//  export const apiProxy = createProxyMiddleware({
//   target : "/avatar",
//   changeOrigin: true,
//   pathFilter : '/api/auth/profilePic'
//  })