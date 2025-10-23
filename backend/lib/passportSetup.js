 import { Strategy as GoogleStrategy } from "passport-google-oauth20";
 import {Strategy as FacebookStrategy} from 'passport-facebook'
 import User from '../models/user.models.js'
 import passport from "passport";
 import 'dotenv/config'


passport.use(new GoogleStrategy({
     clientID: process.env.GOOGLE_CLIENT_ID,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
     callbackURL: "http://localhost:8000/api/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
   try {
    console.log(profile)
   let user = await User.findOne({googleId : profile.id});
   console.log("Found user:", user);
  
   if(!user) {
    user = await User.create({googleId : profile.id,
     firstName:profile.name.givenName,
     lastName:profile.name.familyName,
     email: profile.emails[0]?.value,
     profilePic: profile.photos[0]?.value ,
     verificationToken : "",
     refreshToken : "",
     oAuth : true,
     });

   
     } 
    cb(null, user)
   } catch (error) {
    console.error(error)
    cb(error, null)
   }
   
}


));


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8000/api/auth/facebook/callback",
    profileFields : ["id", "emails", "name", "picture.type(large)"]
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
   try {
    let user = await User.findOne({facebookId : profile.id});
   if(!user) {
     user = await User.create({facebookId : profile.id,
     firstName:profile.name.givenName,
     lastName:profile.name.familyName,
     email:"email@gmail.com",
     profilePic: profile?.photos[0]?.value || null 
     });

  
     } 
    cb(null, user)
   } catch (error) {
    cb(error, null)
   }
  }
));