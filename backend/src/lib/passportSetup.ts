 import { Strategy as GoogleStrategy,  VerifyCallback as GoogleVerifyCB , Profile as GoogleProfile } from "passport-google-oauth20";
 import {VerifyCallback as FacebookVerifyCB } from 'passport-google-oauth20'
 import {Strategy as FacebookStrategy, Profile as FacebookProfile } from 'passport-facebook'
 import User from '../models/user.models.ts'
 import passport from "passport";
 import 'dotenv/config'


passport.use(new GoogleStrategy({
     clientID: process.env.GOOGLE_CLIENT_ID || "",
     clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
     callbackURL: "http://localhost:8000/api/auth/google/callback"
  },
  async function(accessToken:string, refreshToken:string, profile:GoogleProfile, cb:GoogleVerifyCB) {
   try {
    console.log(profile)
   let user = await User.findOne({googleId : profile.id});
   console.log("Found user:", user);
  
   if(!user) {
    user = await User.create({googleId : profile.id,
     firstName:profile.name?.givenName,
     lastName:profile.name?.familyName,
     email: profile?.emails?.[0]?.value,
     profilePic: profile?.photos?.[0]?.value ,
     verificationToken : "",
     refreshToken : "",
     oAuth : true,
     });

   
     } 
    cb(null, user)
   } catch (error) {
    console.error(error)
    cb(error, false)
   }
   
}


));


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || "",
    clientSecret: process.env.FACEBOOK_APP_SECRET || "",
    callbackURL: "http://localhost:8000/api/auth/facebook/callback",
    profileFields : ["id", "email", "name", "picture.type(large)"]
  },
  async function(accessToken:string, refreshToken:string, profile:FacebookProfile, cb: FacebookVerifyCB ) {
    console.log(profile)
   try {
    let user = await User.findOne({facebookId : profile.id});
   if(!user) {
     user = await User.create({facebookId : profile.id,
     firstName:profile.name?.givenName,
     lastName:profile.name?.familyName,
     email: profile.emails?.[0]?.value,
     profilePic: profile?.photos?.[0]?.value || null 
     });

  
     } 
    cb(false, user)
   } catch (error) {
    cb(error, false)
   }
  }
));