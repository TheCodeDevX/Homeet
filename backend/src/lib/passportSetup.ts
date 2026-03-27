 import { Strategy as GoogleStrategy,  VerifyCallback as GoogleVerifyCB , Profile as GoogleProfile } from "passport-google-oauth20";
 import User from '../models/user.models'
 import passport from "passport";
 import 'dotenv/config'


passport.use(new GoogleStrategy({
     clientID: process.env.GOOGLE_CLIENT_ID || "",
     clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
     callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
  },
  async function(accessToken:string, refreshToken:string, profile:GoogleProfile, cb:GoogleVerifyCB) {
   try {
    console.log(profile)
   let user = await User.findOne({googleId : profile?.id});
   console.log("Found user:", user);
  
   if(!user) {
     user = await User.create({
     googleId : profile?.id,
     firstName:profile?.name?.givenName,
     lastName:profile?.name?.familyName,
     email: profile?.emails?.[0]?.value,
     profilePic: profile?.photos?.[0]?.value ,
     verificationToken : "",
     refreshToken : "",
    });

   
     } 
    cb(null, user)
   } catch (error) {
    console.error(error)
    cb(error, false)
   }
   
}

));


