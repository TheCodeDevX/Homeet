

   // @desc   fetch rating
   // @route  GET /api/rating/:id
   // @access Private

import { NextFunction, Request, Response } from "express"
import Listing from "../models/listing.models";
import { createError } from "../utils/createError";
import { userSchema } from "../models/user.models";
import {DateTime} from "luxon"


 export const checkAvailability = async (userCheckIn:string, userCheckOut:string, listingId : string ) => {
    const listing = await Listing.findById(listingId);
      if(!listing) {
         createError("listing not found", 404)
         return;
      }
     
   const bookings = listing.bookings;

      for (const booking of bookings){
         const checkIn = booking.checkIn;
         const checkOut = booking.checkOut;

         const {overlap, overlapRange} = dateRangeOverlap(
          toDate(checkIn),
          toDate(checkOut),
          toDate(userCheckIn),
          toDate(userCheckOut)
         )

       if(overlap) return { overlap : true, overlapRange };
         
       }
       return {overlap: false} // book this property
 }

 const dateRangeOverlap = (checkInA: Date, checkOutA: Date, checkInB: Date, checkOutB: Date) => {
  if(checkInA < checkOutB && checkInB < checkOutA) return {overlap : true, overlapRange :
     `${toTime(checkInA)}-${toTime(checkOutB)}`};
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
    const {checkIn, checkOut, adults, children, pets} = req.body;
    try {
 
      const userCheckIn = DateTime.fromFormat(checkIn, 'yyyy/MM/dd').toISO() as string;
      const userCheckOut = DateTime.fromFormat(checkOut, 'yyyy/MM/dd').toISO() as string;
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
    
     const availability = await checkAvailability(userCheckIn, userCheckOut, listingId)
     if(availability?.overlap) return res.status(400).json({message : `there is an overlap between
      ${availability?.overlapRange}. This property is already booked at the selected time`})
   
   const bookingAlreadyExists = listing.bookings.some(booking => booking.userId === req.authUser._id.toString());  
  console.log("bookingAlreadyExists", bookingAlreadyExists)
   if(!bookingAlreadyExists) {
      await listing.updateOne({ $push : {bookings : {
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
   }}})
   res.status(200).json({message : "This property is available"})
   } else return res.status(400).json({message : "You've already booked this property!"})
       
   }
    
   catch (error) {
    console.log('error in bookProperty controller', error)  
    next(error)
    }
   }