import asyncHandler from 'express-async-handler'
import User from '../models/user.models.js';
import genToken from '../lib/generateToken.js'
import cloudinary from '../lib/cloudinary.js';
import passport from 'passport';
import { createError } from '../utils/createError.js';
import { sendResetPasswordRequest, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeMessage } from '../Mail/nodemailer.js';
import { capitalizedName } from '../utils/capitalizedName.js';
import crypto from 'crypto'
import bcrypt from 'bcryptjs';
import fetch from 'node-fetch'
import { genRefreshToken } from '../lib/generateRefreshToken.js';

// @desc   Register a new user 
// @route  POST /api/auth/signup
// @access Public
export const signup = async(req, res, next) => {

 try {
    const {firstName , lastName, email, password} = req.body;
 // existing email 
 const existingEmail = await User.findOne({email});
 if(existingEmail) createError("EMAIL_ALREADY_EXISTS")

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

 res.status(201).json({success : true, user:newUser, message:"SUCCESSFUL_SIGNUP"})


 } catch (error) {
    console.error("error in signup controller",error);
    next(error)
 }
}

// @desc   Authenticate user and send token in http-Only cookie
// @route  POST /api/auth/login
// @access Public
export const login = async(req, res, next) => {
 try {
   const {email , password } = req.body;
   const user = await User.findOne({email});
   if(!user) createError('INVALID_EMAIL',400)

   const isCorrectPassword = await user.matchPassword(password);
   if(!isCorrectPassword) createError("INVALID_PASS",400)
   genToken(res, user._id);
    if(!user.isVerified && ( new Date(user.refreshTokenExpiresAt) < new Date() ) ) {
         genRefreshToken(res, user);
      }
   res.status(200).json({
    user, message : "SUCCESSFUL_LOGIN", success:true
   })
   console.log(user)

 } catch (error) {
   console.error("error in login controller",error)
   next(error)
 }
  
};

// @desc   Log out user by clearing the JWT cookie 
// @route  POST /api/auth/logout
// @access Public
export const logout = async(req, res, next) => {
try {
   res.clearCookie('jwt');
   res.status(200).json({message:"SUCCESSFUL_LOGOUT", success:true});
} catch (error) {
   console.error("error in logout controller", error);
   next(error);
}
}


// @desc   Update the user's profile
// @route  PUT /api/auth/update-profile
// @access Private
export const updateProfile = async(req, res, next) => {
try {
   const {firstName, lastName, email, profilePic, bio, gender, address, phoneNumber, role, currency} = req.body;
   const userId = req.user._id;
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

    if (!updatedUser && !updatedUser.onBoarded) {
      createError("FAILED_ONBOARDING", 404);
      return;
    }

   res.status(200).json({success:true, user:updatedUser, 
   message : ["UPDATED_PROFILE", "COMPLETED_ONBOARDING"],
    missingFields : [
      !profilePic && "Profile Picture",
      !gender && "Gender",
      !bio && "Biography",
      !address && "Address",
      !phoneNumber && "Phone Number"
    ].filter[Boolean]
   })
   
} catch (error) {
   console.error("error in updateProfile controller", error);
   next(error);
}
}


// @desc   Verify user's email
// @route  POST /api/auth/verify-email
// @access Public

 export const verifyEmail = async(req, res, next) => {
 try {
    const {code} = req.body;
    const isCorrectCode = await User.findOne({ verificationToken: code });
    if(!isCorrectCode) {
      createError("INVALID_VERIFICATION_CODE", 400);
      return;
    }

  const user = await User.findOne({
   verificationTokenExpiresAt :{ $gt: new Date() }
  })

  
  if(!user) {
  const errKey = "EXPIRED_VERIFICATION_CODE"
  return res.status(200).send(errKey);
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
  res.status(200).json({
   success: true, 
   message : "VERIFIED_EMAIL",
   user
  })
 } catch (error) {
   console.error("error in verifyEmail Controller")
   next(error);
 }

 }

 // @desc   Generating refresh-token  
// @route  POST /api/auth/profilePic
// @access Private

export const refreshToken = async (req, res, next) => {
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

 export const forgotPassword = async(req, res, next) => {
   try {
      const {email} = req.body;
      const user = await User.findOne({email});
      if(!user) createError("UNFOUND_EMAIL");

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

 export const resetPassword = async(req, res, next) => {
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
   await sendResetSuccessEmail(capitalizedName(user.firstName))
   res.status(200).json({success:true, message : "RESET_PASSWORD"})
 } catch (error) {
   console.error("error in resetPassword controller")
   next(error);
 }
 }


// @desc   Authenticate the user
// @route  GET /api/auth/check
// @access Private
export const checkAuth = async(req, res) => {
   try {
      res.status(200).json({user: req.user});
   } catch (error) {
      console.error("error in checkAuth controller", error);
   }
}

// @desc   Sending the user's profilePic  
// @route  GET /api/auth/profilePic
// @access Private
export const profilePic = async(req, res, next) => {
   try {
    const {url} = req.query;
    console.log(url)
    if(!url) {
      createError("URL is missing!", 404);
      return;
    }
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    console.log(buffer)
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg")
    res.send(Buffer.from(buffer))
   } catch (error) {
      console.error("error in profilePic controller", error);
      next(error);
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
export const googleCallback = asyncHandler(async(req, res, next) => {
    passport.authenticate("google", {session:false}, (err, user) => {
    if(err || !user) return res.redirect("http://localhost:3000/login");
    genToken(res, user._id);
    genRefreshToken(res, user)
    res.redirect("http://localhost:3000?message=AUTH_USER")
})(req, res , next)
})










