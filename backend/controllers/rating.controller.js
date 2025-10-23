

import mongoose from "mongoose"
import Listing from "../models/listing.models.js"
import Rating from "../models/rating.models.js"
import { createError } from "../utils/createError.js"
import chalk from "chalk"
 

// @desc   Rate a listing
// @route  Post /api/rating/:id
// @access Private
export const rateListing = async(req, res, next) => {
try {
 const {stars, feedback} = req.body
 console.log(stars)
 const {id:listingId} = req.params
 const userId = req.user.id

 const rating = await Rating.findOneAndUpdate({user : userId, listing : new mongoose.Types.ObjectId(listingId) },
     {value:stars, feedback}, {upsert:true, new:true})
     .populate("user")
     .populate("listing")
 if(!rating) {
  createError("invalid rating", 400)
 }

 const states =  await Rating.aggregate([
  { $match : { listing : new mongoose.Types.ObjectId(listingId) } },
  { $group : { _id : "$listing", average : {$avg : "$value"} , count : {$sum : 1} } }
 ])
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

// @desc   fetch ratings
// @route  GET /api/rating/:id
// @access Private

 export const getRatings = async(req, res, next) => {
    try {
        const {id} = req.params;

        console.log(id, "ID FROM GET RATINGS")
        const rating = await Rating.findOne({listing : new mongoose.Types.ObjectId(id)})
        if(!rating) {
            createError("UNFOUND_RATING", 404)
        }
         res.status(200).json({rating})
    } catch (error) {
        console.error("error in getRating controller", error)
        next(error);
    }
 }