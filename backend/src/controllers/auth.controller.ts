import asyncHandler from 'express-async-handler'
import {Request, Response, NextFunction} from "express"
import User from '../models/user.models.ts';
import genToken from '../lib/generateToken.ts'
import cloudinary from '../lib/cloudinary.ts';
import passport from 'passport';
import { createError } from '../utils/createError.ts';
import { sendResetPasswordRequest, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeMessage } from '../Mail/nodemailer.ts';
import { capitalizedName } from '../utils/capitalizedName.ts';
import crypto from 'crypto'
import bcrypt from 'bcryptjs';
import fetch from 'node-fetch'
import { genRefreshToken } from '../lib/generateRefreshToken.ts';
import { connectDB } from '../config/db.ts';
import type { AuthResponse, LogoutResponse, ProfileData, ProfileResponse, UserDocument, UserResponse, VerifyEmailResponse } from '../shared/types/types.ts';

// @desc   Register a new user 
// @route  POST /api/auth/signup
// @access Public
export const signup = async(req:Request, res:Response, next:NextFunction) => {

 try {
    const {firstName , lastName, email, password} = req.body;
 // existing email 
 const existingEmail = await User.findOne({email});
 if(existingEmail) {
   createError("EMAIL_ALREADY_EXISTS", 400)
   return;
 }

 // create a new user 
 const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
 })


 if(!newUser) createError('INVALID_DATA', 400)
 genToken(res, newUser._id);
 genRefreshToken(res, newUser);
await sendVerificationEmail(newUser.email, capitalizedName(newUser.firstName), newUser.verificationToken)

const signupResponse : AuthResponse = { user:newUser, message:"SUCCESSFUL_SIGNUP", success : true} 

 res.status(201).json(signupResponse)


 } catch (error) {
    console.error("error in signup controller",error);
    next(error)
 }
}

// @desc   Authenticate user and send token in http-Only cookie
// @route  POST /api/auth/login
// @access Public
export const login = async(req:Request, res:Response, next:NextFunction) => {
 try {
   const {email , password } = req.body;
   const user = await User.findOne({email});
   if(!user) {
      createError('INVALID_EMAIL', 401);
      return;
   }

   const isCorrectPassword = await user.matchPassword(password);
   if(!isCorrectPassword) {
      createError("INVALID_PASS", 401); // Unauthorized
      return;
   }
   genToken(res, user._id);
    if(!user.isVerified && ( new Date(user.refreshTokenExpiresAt) < new Date() ) ) {
         genRefreshToken(res, user);
      }

   const loginResponse : AuthResponse = {user, message : "SUCCESSFUL_LOGIN", success:true}   

   res.status(200).json(loginResponse)
   console.log(user)

 } catch (error) {
   console.error("error in login controller",error)
   next(error)
 }
  
};

// @desc   Log out user by clearing the JWT cookie 
// @route  POST /api/auth/logout
// @access Public
export const logout = async(req:Request, res:Response, next:NextFunction) => {
try {
   res.clearCookie('jwt');
   const logoutResponse : LogoutResponse = {message:"SUCCESSFUL_LOGOUT", success:true}
   res.status(200).json(logoutResponse);
} catch (error) {
   console.error("error in logout controller", error);
   next(error);
}
}


// @desc   Update user's profile
// @route  PUT /api/auth/update-profile
// @access Private
export const updateProfile = async(req:Request, res:Response, next:NextFunction) => {
try {
   const {firstName, lastName, email, profilePic, bio, gender, address, phoneNumber, role, currency} = req.body;
   const userId = req.authUser._id;
   console.log(profilePic, "profilePic")
   const uploadResponse = await cloudinary.uploader.upload(profilePic);
   const updatedUser = await User.findByIdAndUpdate(userId, { 
      firstName,
      lastName, 
      email,
      onBoarded : true,
      profilePic : uploadResponse.secure_url,
      gender,
      bio,
      role,
      address,
      phoneNumber,
      currency
    }, {new : true});

    if(!updatedUser) {   
      createError("User not found", 404);
      return;
    }
    if (!updatedUser.onBoarded) {
      createError("FAILED_ONBOARDING", 403);
      return;
    }

    const profileResponse : ProfileResponse = {
      success:true,
      user:updatedUser, 
      message : ["UPDATED_PROFILE", "COMPLETED_ONBOARDING"],
      missingFields : [
      !profilePic && "Profile Picture",
      !gender && "Gender",
      !bio && "Biography",
      !address && "Address",
      !phoneNumber && "Phone Number"
    ].filter((field) => Boolean(field))
   }

   res.status(200).json(profileResponse)
   
} catch (error) {
   console.error("error in updateProfile controller", error);
   next(error);
}
}


// @desc   Verify user's email
// @route  POST /api/auth/verify-email
// @access Public

 export const verifyEmail = async(req:Request, res:Response, next:NextFunction) => {
 try {
    const {code} : {code : number} = req.body;
    const isCorrectCode = await User.findOne({ verificationToken: code });
    if(!isCorrectCode) {
      createError("INVALID_VERIFICATION_CODE", 401);
      return;
    }

  const user = await User.findOne({
   verificationTokenExpiresAt :{ $gt: new Date() }
  })

  
  if(!user) {
  const errKey = "EXPIRED_VERIFICATION_CODE"
  return res.json(errKey);
  }
   const token = genToken(res, user._id);
  await sendWelcomeMessage(capitalizedName(user.firstName), token , user.email)

  await User.updateOne({_id:user._id}, {
   $set : {
   isVerified: true,
   },

   $unset : {
   verificationToken : null ,
   verificationTokenExpiresAt: null,
   refreshToken : null,
   refreshTokenExpiresAt : null
   }

  });

  res.clearCookie("refreshToken");
  const verfiyEmailResponse : VerifyEmailResponse = {
   success: true, 
   message : "VERIFIED_EMAIL"
  }
  res.status(200).json(verfiyEmailResponse)
 } catch (error) {
   console.error("error in verifyEmail Controller")
   next(error);
 }

 }

 // @desc   Generating refresh-token  
// @route  POST /api/auth/profilePic
// @access Private

export const refreshToken = async(req:Request, res:Response, next:NextFunction) => {
   try {
      console.log("hit refreshToken", req.query.code)
      const {code} = req.query;
      const {refreshToken} = req.cookies

      const storedVerificationToken = crypto.createHash("sha256").update(refreshToken).digest("hex")

      const user = await User.findOneAndUpdate({
         verificationToken : code,
         verificationTokenExpiresAt : { $lt : new Date() },
         refreshToken : storedVerificationToken,
         refreshTokenExpiresAt: { $gt : new Date() }
      },
       { $set :  { 
            verificationTokenExpiresAt : new Date( Date.now() + 1000 * 60 * 15 ),
            verificationToken : Math.floor(100000 + Math.random() * 900000),
           
          }});
          

      if(!user) {
         Object.keys(req.cookies).forEach((c) => res.clearCookie(c));
         createError("UNAUTH_USER", 401);
         return;
      }

          res.status(200).send(user.verificationToken);
          console.log(user.verificationToken)

   } catch (error) {
      console.error("error in refreshToken controller", error);
      next(error);
   }
}

 // @desc   Handle forgot passowrd logic
// @route  POST /api/auth/forgot-password
// @access Public

 export const forgotPassword = async(req:Request, res:Response, next:NextFunction) => {
   try {
      const {email} = req.body;
      const user = await User.findOne({email});
      if(!user) {
         createError("UNFOUND_EMAIL", 400);
         return;
      }

      // generate random token 
      const resetPasswordToken = crypto.randomBytes(32).toString("hex");
      const  resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 60)

      await User.updateOne({_id:user._id}, { resetPasswordToken, resetPasswordExpiresAt })
      await sendResetPasswordRequest(capitalizedName(user.firstName), user.email, resetPasswordToken)
      res.status(200).json({success:true , message : "RESET_PASSWORD"})
   } catch (error) {
      console.error("error in forgotPassword controller")
      next(error);
   }
 }

 // @desc  Reset user's password
// @route  PUT /api/auth/reset-password/:token
// @access Public

 export const resetPassword = async(req:Request, res:Response, next:NextFunction) => {
 try {
     const {token} = req.params;
   const {password} = req.body;

   const user = await User.findOne({resetPasswordToken: token, resetPasswordExpiresAt: {$gt : new Date()}});
   if(!user) {
      createError("INVALID_OR_EXPIRED_RLINK", 401)
   return;
   }
      // hash and update passoword
   const hashedPassword = await bcrypt.hash(password, 10);
   await User.updateOne({_id:user._id}, { $set : {password: hashedPassword ,
       resetPasswordToken:null, resetPasswordExpiresAt:null} })
   await sendResetSuccessEmail(capitalizedName(user.firstName), user.email)
   res.status(200).json({success:true, message : "RESET_PASSWORD"})
 } catch (error) {
   console.error("error in resetPassword controller")
   next(error);
 }
 }


// @desc   Authenticate the user
// @route  GET /api/auth/check
// @access Private
export const checkAuth = async(req:Request, res:Response) => {
   try {
      const userResponse : UserResponse = {
       user : req.authUser
      }
      res.status(200).json(userResponse);
   } catch (error) {
      console.error("error in checkAuth controller", error);
   }
}

// @desc   Sending the user's profilePic  
// @route  GET /api/auth/profilePic
// @access Private
export const profilePic = async(req:Request, res:Response, next:NextFunction) => {
   try {
    const {url} = req.query;
    console.log(url)
    if(!url) {
      createError("URL is missing!", 404);
      return;
    }
    const response = await fetch(url.toString());
    const buffer = await response.arrayBuffer();
    console.log(buffer)
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg")
    res.send(Buffer.from(buffer))
   } catch (error) {
      console.error("error in profilePic controller", error);
      next(error);
   }
}

// @desc   Warming up the server for an auth user
// @route  GET /api/auth/ping
// @access Private

export const warmUp = async(req:Request, res:Response, next:NextFunction) => {
 try {
   const conn = await User.exists({email : "user@example.com"})
   res.status(200).json(conn)
   console.log("The server is warmed up now!", conn)
 } catch (error) {
   res.status(503).json("The server is unavailable now, please try again later after being warmed up!")
 }
}


// @desc   Handle unauthorized user
// @route  GET /api/auth/google/failed - OR - /api/auth/facebook/failed
// @access Public
export const  handleUnauthorized = asyncHandler(async(req, res) => {
         res.status(401).json({
         success : false,
         message : "UNAUTH_USER"
    })
})


// @desc   Handle authorized user
// @route  GET /api/auth/google/success  - OR - /api/auth/facebook/success
// @access Public
export const  handleAuthorized = asyncHandler(async(req, res) => {
   res.status(200).json({
        success : true,
        message : "AUTH_USER",
        user : req.user
})


})

// @desc   handle google callback 
// @route  GET /api/auth/google/callback
// @access Public
export const googleCallback = asyncHandler(async(req:Request, res:Response, next:NextFunction) => {
    passport.authenticate("google", {session:false}, (err:Error, user:UserDocument) => {
    if(err || !user) return res.redirect("http://localhost:3000/login");
    genToken(res, user._id);
    genRefreshToken(res, user)
    res.redirect(`http://localhost:3000?message=AUTH_USER`)
})(req, res , next)
})










