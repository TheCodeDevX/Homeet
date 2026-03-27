

   // @desc   fetch rating
   // @route  GET /api/rating/:id
   // @access Private

import { NextFunction, Request, Response } from "express"
import Listing from "../models/listing.models";
import { createError } from "../utils/createError";
import {DateTime} from "luxon"
import {format} from "date-fns"


 export const checkAvailability = async (listingId : string, userCheckIn:string , userCheckOut:string) => {
   // we'll never invoke this without checkIn && checkOut
   if(!listingId) {
      createError("LISTING_ID_NOT_FOUND", 404)
      return;
   }
   const listing = await Listing.findById(listingId);
   if(!listing) {
         createError("LISTING_NOT_FOUND", 404);
         return;
   }
   if(!(userCheckIn || userCheckOut)) return;
   const bookings = listing.bookings;

      for (const booking of bookings){
         const checkIn = booking.checkIn;
         const checkOut = booking.checkOut;

          const {overlap, overlapRange} = dateRangeOverlap(
          toDate(checkIn as string),
          toDate(checkOut as string),
          toDate(userCheckIn),
          toDate(userCheckOut)
          )

        if(overlap) return { overlap : true, overlapRange }; 
        return {overlap: false} // book this property
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

//  const toTime = (date:Date) => {
//   return date.toLocaleTimeString("en-US", {hour12:true, hour:"numeric"})
//  }

   export const bookProperty = async(req:Request, res:Response, next:NextFunction) => {
    const {listingId} = req.params;
    const {checkIn, checkOut, offerPrice, adults, children, pets, duration, costPrice, message}
     = req.body;

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

      if(listing.bookings.some((b) => (b?.userId) === (req.authUser._id).toString())) {
         createError((checkIn && checkOut) ? "ALREADY_BOOKED" : "DUPLICATED_OFFER", 400);
         return;
      }
       const isOneTime = listing.pricingType === "one_time"
       const isMonthly = listing.pricingType === "monthly"
       const isNightly = listing.pricingType === "nightly"

       if(!isOneTime && !(checkIn || checkOut)) {
         createError("CheckIn & CheckOut dates are required!", 400);
       }


       if(!isOneTime && !costPrice) {
         createError("Cost price required!", 400);
       }
        if(isOneTime && !(offerPrice?.amount || offerPrice?.currency)) {
         createError("Offer price required!", 400);
       }



      const userCheckIn = isOneTime
      ? undefined 
      : DateTime.fromFormat(checkIn, 'yyyy/MM/dd').toISO() as string;

      const userCheckOut = isOneTime
      ? undefined 
      : DateTime.fromFormat(checkOut, 'yyyy/MM/dd').toISO() as string;
     
      if(!isOneTime) {
      if(listing?.adults < adults) {
         createError("You cannot excceed the max capacity of adults", 400)
         return
      }

       if(listing?.children < children) {
         createError("You cannot excceed the max capacity of children", 400)
         return
      }

      
       if(listing?.pets < pets) {
         createError("You cannot excceed the max capacity of pets", 400)
         return
      }
    
     const availability = await checkAvailability(listingId, userCheckIn ?? "", userCheckOut ?? "")
     if(availability?.overlap) return res.status(400).json({message : `OVERLAP&${availability.overlapRange}`})
      }
   
   const bookingAlreadyExists = listing.bookings.some(booking => booking.userId === req.authUser._id.toString());  
  console.log("bookingAlreadyExists", bookingAlreadyExists)
 
   // if(!bookingAlreadyExists) {

      const handleBookingData = () => {
         if(isOneTime) return {booking : {
         firstName : req.authUser.firstName,
         lastName : req.authUser.lastName,
         phoneNumber : req.authUser.phoneNumber,
         email : req.authUser.email,
         userId : req.authUser._id,
         offerPrice : {amount_local : offerPrice?.amount_local, amount_usd:offerPrice?.amount_usd, currency : offerPrice?.currency},
         message,
         profilePicture : req.authUser.profilePic,
         role : req.authUser?.role
         }}
         return {booking : {
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
         costPrice : {amount_local : costPrice?.amount_local, amount_usd:costPrice?.amount_usd, currency : costPrice?.currency},
         profilePicture : req.authUser.profilePic,
         role : req.authUser?.role
         }}
      }
      const {booking} = handleBookingData()
      await listing.updateOne({ $push : {bookings : booking}});

   // const my_booking = listing.bookings.find(b => b.userId === req.authUser._id);
   res.status(200).json({message : checkIn && checkOut ? "CONFIRMED_BOOKING" : "CONFIRMED_OFFER"})
   }
   //  else return res.status(400).json({message : "ALREADY_BOOKED"})
       
   // }
   catch (error) {
    console.log('error in bookProperty controller', error)  
    next(error)
    }
   }