

   // @desc   fetch rating
   // @route  GET /api/rating/:id
   // @access Private

import { NextFunction, Request, Response } from "express"
import Listing from "../models/listing.models";
import { createError } from "../utils/createError";
import { userSchema } from "../models/user.models";
import {DateTime} from "luxon"
import {format} from "date-fns"
import mongoose from "mongoose";


 export const checkAvailability = async (listingId : string, userCheckIn:string, userCheckOut?:string) => {
    const listing = await Listing.findById(listingId);
      if(!listing) {
         createError("LISTING_ID_NOT_FOUND", 404)
         return;
      }
     
   const bookings = listing.bookings;

      for (const booking of bookings){
         const checkIn = booking.checkIn;
         const checkOut = booking.checkOut;

         if(!userCheckOut) {
          const overlap = toDate(checkIn) < toDate(userCheckIn) &&  toDate(checkOut) > toDate(userCheckIn)    
          if(overlap)  return {overlap : true}
          return {overlap : false};
         } else {
          const {overlap, overlapRange} = dateRangeOverlap(
          toDate(checkIn),
          toDate(checkOut),
          toDate(userCheckIn),
          toDate(userCheckOut)
         )

        if(overlap) return { overlap : true, overlapRange }; 
        return {overlap: false} // book this property
       }
      
 }
        
 }

 const dateRangeOverlap = (checkInA: Date, checkOutA: Date, checkInB: Date, checkOutB: Date) => {
  if(checkInA < checkOutB && checkInB < checkOutA) return {overlap : true, overlapRange :
     `${format(checkInA, "d MMM h:mmaa")} - ${format(checkOutB, "d MMM h:mmaa")}`};
  return {overlap:false}

 }
 // checkIn(A) : 8:00am -----------> checkOut(A) : 10:00AM
 // checkIn(B) : 7:00am -----------> checkOut(B) : 9:30AM
 // checkOutB is greater than checkInA + checkInB < checkOutA
 // --> authUserCheckOut must be greater than old checkIn's otherwise it's fine since checkOut is greater than
 //  checkIn

 const toDate = (date: string) => {
  return new Date(date)
 }

 const toTime = (date:Date) => {
  return date.toLocaleTimeString("en-US", {hour12:true, hour:"numeric"})
 }

   export const bookProperty = async(req:Request, res:Response, next:NextFunction) => {
    const {listingId} = req.params;
    const {checkIn, checkOut, adults, children, pets, duration, totalPrice} = req.body;

    try {
  
      console.log('Book Property', {...req.body})
        if(!listingId) {
         createError("listing id not found", 404)
         return;
      }
      const listing = await Listing.findById(listingId);
      if(!listing) {
         createError("listing not found", 404)
         return;
      }

      if(listing.bookings.some((b) => new mongoose.Types.ObjectId(b._id) === (req.authUser._id))) {
         createError("ALREADY_BOOKED", 400);
         return;
      }

      const userCheckIn = DateTime.fromFormat(checkIn, 'yyyy/MM/dd').toISO() as string;
      const userCheckOut = listing.pricingType === "one_time"
      ? undefined 
      : DateTime.fromFormat(checkOut, 'yyyy/MM/dd').toISO() as string;

      // if(listing.adults < adults) {
      //    createError("the number of adults should be less ", 400)
      //    return
      // }

      //  if(listing.children < children) {
      //    createError("the number of children should be less ", 400)
      //    return
      // }
    
    
     const availability = await checkAvailability(listingId, userCheckIn, userCheckOut)
     if(availability?.overlap) return res.status(400).json({message : `OVERLAP&${availability.overlapRange}`})
   
   const bookingAlreadyExists = listing.bookings.some(booking => booking.userId === req.authUser._id.toString());  
  console.log("bookingAlreadyExists", bookingAlreadyExists)
 
   if(!bookingAlreadyExists) {
      let costPrice : number = 0;
      if(listing.pricingType === "monthly") {
        costPrice = (duration?.months * listing.price);
      } else if (listing.pricingType === "nightly") {
        costPrice = (duration?.nights * listing.price); 
      } else if (listing.pricingType === "one_time"){
         costPrice = listing.price;
      }

      const booking = await listing.updateOne({ $push : {bookings : {
      checkIn : userCheckIn,
      checkOut : userCheckOut,
      firstName : req.authUser.firstName,
      lastName : req.authUser.lastName,
      phoneNumber : req.authUser.phoneNumber,
      email : req.authUser.email,
      adultsCount: adults,
      childrenCount : children,
      petsCount : pets,
      userId : req.authUser._id,
      costPrice
   }}});

   // const my_booking = listing.bookings.find(b => b.userId === req.authUser._id);
   res.status(200).json({message : "CONFIRMED_BOOKING", booking})
   } else return res.status(400).json({message : "ALREADY_BOOKED"})
       
   }
   catch (error) {
    console.log('error in bookProperty controller', error)  
    next(error)
    }
   }