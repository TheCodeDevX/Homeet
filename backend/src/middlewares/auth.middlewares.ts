import jwt, { JwtPayload } from "jsonwebtoken";
import 'dotenv/config'
import User from "../models/user.models.ts";
import asyncHandler from "express-async-handler";
import { createError } from "../utils/createError.ts";
import type { ID, UserData, UserDocument } from "../shared/types/types.ts";
import { NextFunction, Response, Request } from "express";
// import {createProxyMiddleware} from "http-proxy-middleware"

declare global {
  namespace Express {
    interface Request {
      authUser : UserDocument;
    }
  }
   
}

 interface CustomJwtPayload extends JwtPayload {
  userId : string
 }



 const JWT_SECRET = process.env.JWT_SECRET as string;

 export const protect = asyncHandler(async (req:Request, res:Response, next:NextFunction) => {
 
  try {
    let token = req.cookies.jwt;
    console.log(token)
    if(!token) {
      createError("Unauthorized, no token provided", 401)
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    if(!decoded) createError("Unauthorized , invalid token", 401);
    const user = await User.findById(decoded.userId).select("-password -refreshToken -refreshTokenExpiresAt");
    if(!user) {
       createError("User not found", 404);
       return;
    }
    req.authUser = user;
    next()
  } catch (error) {
    console.error("error in protect middleware", error);
    next(error)
  }
 });


 export const verifyEmailToken = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const {token} = req.query;
    if(!token) {
      createError("Unauthorized, no token provided", 401);
      return;
    }
      const decoded = jwt.verify(token?.toString() as string, JWT_SECRET) as CustomJwtPayload;
    if(!decoded) createError("Unauthorized , invalid token", 401)
      const user = await User.findById(decoded.userId).select("-password -refreshToken -refreshTokenExpiresAt");
    if(!user) {
      createError("User not found", 404);
      return;
    }
    req.authUser = user;
    next()
  } catch (error) {
    console.error("error in verifyEmailToken middleware")
    next(error)
  }
 }
