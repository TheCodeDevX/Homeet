import User from "../models/user.models.ts";
import { createError } from "../utils/createError.ts";
import { Response, Request, NextFunction } from "express";




 // @desc   Handle authorized user
 // @route  GET /api/subscription/subscribe
 // @access Public
 export const subscribe = async(req:Request, res:Response, next:NextFunction) => {
try {
  const user = req.authUser;
  if(!user) createError("User not found", 404);
  const alreadySubscribed = user.isSubscribed === 'subscribed';
  if(alreadySubscribed) createError("User is already subscribed", 400)
    await User.findByIdAndUpdate(user._id, {isSubscribed : "subscribed"}, {new:true})
// new : returns the updated document immediately
  res.redirect("/subscribed");
} catch (error) {
      console.error("error in subscribe controller")
      next(error)  
}
 }

  // @desc  Handle authorized user
 // @route  GET /api/subscription/unsubscribe
 // @access Public

 export const unsubscribe = async(req:Request, res:Response, next:NextFunction) => {
  try {
    const user = req.authUser;
    if(!user) createError("User not found", 404);
    await User.findByIdAndUpdate(user._id, { isSubscribed : "unsubscribed"}, {new: true})
    res.redirect("/unsubscribed")
  } catch (error) {
     console.error("error in unsubscribe controller")
      next(error) 
  }
 }