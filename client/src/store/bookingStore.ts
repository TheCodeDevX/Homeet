import { create } from "zustand";
import { BookingApi } from "../lib/axios.config";
import { errorHandler } from "./helpers/errorHelper";
import type { CurrencyCode } from "../types/types";
import type { PricingType } from "./listingStore";

 export type BookingType<T extends PricingType> = (T extends "one_time" 
   ? {
      offerPrice : {amount_local: number, amount_usd:number, currency : CurrencyCode}, 
      message?:string,
      _id: string,
      createdAt?: string,
   } 
   : {
    pricingType : PricingType
    checkIn: string,
    checkOut: string,
    adults : number,
    children : number,
    pets : number,
    createdAt?: string,
    costPrice: {amount_local: number, amount_usd:number, currency : CurrencyCode}, 
    _id : string,
 } & T extends "nightly" ? {nights:number} : {months:number})

 interface Booking {
  isBookingLoading : boolean
  booking : BookingType<PricingType> | null
  bookings : BookingType<PricingType>[]
  error : string | null
  message : string
  createBooking : (listingId?:string, booking?: Omit<BookingType<PricingType>, "createdAt" | "_id">) => void
 }


 export const useBookingStore = create<Booking>((set) => ({
    isBookingLoading : false,
    booking: null,
    bookings: [],
    error: null,
    message : '',
    createBooking : async (listingId, booking) => {
    set({isBookingLoading : true, error : null})
    try {
     const response = await BookingApi.post(`/book-property/${listingId}`, booking)
     set({isBookingLoading:false, message: response?.data?.message})
    } catch (error) {
    const err  = errorHandler({error, defaultErr :"BOOKING_FAILED"})
    set({isBookingLoading:false, error:err})
    throw error;
    }
    }
 }))