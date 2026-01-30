

import mongoose from "mongoose"
import Listing from "../models/listing.models.ts"
import Rating from "../models/rating.models.ts"
import { createError } from "../utils/createError.ts"
import chalk from "chalk"
import {Request, Response, NextFunction} from "express"
import Likes from "../models/likes.models.ts"
 

// @desc   Rate a listing
// @route  Post /api/rating/:id
// @access Private
export const rateListing = async(req:Request, res:Response, next:NextFunction) => {
try {
 const {stars, feedback} = req.body
 console.log(stars)
 const {id:listingId} = req.params
 const userId = req.authUser.id

 const rating = await Rating.findOneAndUpdate({user : userId, listing: new mongoose.Types.ObjectId(listingId) },
     {value:stars, feedback}, {upsert:true, new:true})
     .populate("user")
     .populate("listing")
 if(!rating) {
  createError("invalid rating", 400)
  return;
 }

 const states =  await Rating.aggregate([
  { $match : { listing : new mongoose.Types.ObjectId(listingId) } },
  { $group : { _id : "$listing", average : {$avg : "$value"} , count : {$sum : 1} } }
 ]);



console.log(chalk.yellow(`states : ${states[0]}`))
 if(states.length > 0) {
    await Listing.findByIdAndUpdate(new mongoose.Types.ObjectId(listingId)
    , { avgRating: states[0].average, count : states[0].count }, {new : true} )
 }
console.log("your rating", rating)
const updatedListing = await Listing.findById(new mongoose.Types.ObjectId(listingId)) 
 res.status(201).json({rating, listing:updatedListing, message : "SUCCESSFUL_RATING"})

} catch (error) {
    console.error("error in rateListing controller", error);
    next(error)
}
}

// @desc   fetch rating
// @route  GET /api/rating/:id
// @access Private

 export const getRating = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {id} = req.params;

        console.log(id, "ID FROM GET RATINGS")
        const rating = await Rating.findById(id)
        if(!rating) {
            createError("UNFOUND_RATING", 404)
            return
        }
         res.status(200).json({rating})
    } catch (error) {
        console.error("error in getRating controller", error)
        next(error);
    }
 }

// @desc  fetch ratings
// @route  GET /api/ratings/:listingId
// @access Private

 export const getRatings = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {listingId} = req.params
        const ratings = await Rating.find({listing : listingId, feedback:{$ne : ""} }).populate("user");
        if(!ratings) {
            createError("couldn't find ratings", 404)
            return
        }
         res.status(200).json(ratings)
    } catch (error) {
        console.error("error in getRating controller", error)
        next(error);
    }
 }


 // @desc  like a rating
// @route  Post /api/rating/likes/:ratingId
// @access Private

 export const likeRating = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {ratingId} = req.params;
        const userId = req.authUser.id;
        if(!ratingId) {
            createError("ratingId not found", 404);
            return;
        }

         const alreadyLiked = (await Likes.findOne({
            rating: new mongoose.Types.ObjectId(ratingId),
            user : userId
         }))?.likes === 1
      
        const likes = await Likes.findOneAndUpdate({
            rating: new mongoose.Types.ObjectId(ratingId),
            user : userId
        }, {likes: alreadyLiked ? 0 : 1}, {upsert:true, new:true})

         if(!likes) {
            createError("couldn't find likes", 404)
            return;
        }

        console.log(req.query, 'query')
        const states = await Likes.aggregate([
           { $match : {rating: new mongoose.Types.ObjectId(ratingId)}},
           { $group : {_id : "$rating", likes : {$sum : "$likes"} }}
        ]);
        console.log("STATES", states, "RATINGID", ratingId, 'alreadyLiked', alreadyLiked)
        if(states.length === 0) return;

        const rating = await Rating.findOneAndUpdate(
            {_id: ratingId},
            alreadyLiked ? { $pull : {likers : req.authUser.id} } : {$addToSet: {likers : req.authUser.id }},
             {new:true, timestamps:false}
    );
         if(!rating) {
            createError("couldn't find rating", 404)
            return;
        }

         console.log("RATING", rating)
         res.status(200).json(rating.likers);
    } catch (error) {
        console.error("error in likeRating controller", error)
        next(error);
    }
 }

//  // @desc  fetch user likes
// // @route  Post /api/rating/likes/user/:id
// // @access Private

//  export const getLikes = async(req:Request, res:Response, next:NextFunction) => {
//     try {  
//     const {id:ratId} = req.params 

//     const likes = await Likes.findOne({
//         user:new mongoose.Types.ObjectId(req.authUser._id),
//         rating: new mongoose.Types.ObjectId(ratId),
//     });
//     // if(!likes) {
//     //     createError('likes not found', 404)
//     //     return;
//     // }
//     if(!likes) return res.status(200).json({userHasLikedRating:false})
//    const ratingId = (await Rating.findById(likes?.rating?._id))?._id;
   
//   console.log(ratingId, 'rating id')
    
//     res.status(200).json({ userHasLikedRating: !!(ratingId && likes.likes > 0)});
//     } catch (error) {
//         console.error("error in getLikes controller", error)
//         next(error);
//     }
//  }