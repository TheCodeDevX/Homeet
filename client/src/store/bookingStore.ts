import { create } from "zustand";
import { BookingApi } from "../lib/axios.config";
import { errorHandler } from "./helpers/errorHelper";

 interface BookingType {
    checkIn?: string,
    checkOut?: string,
    adults : number,
    children : number,
    pets : number,
    createdAt?: string,
    totalPrice : number,
    duration : { months?: number, nights?: number }, 
    _id : string,
 }

 interface Booking {
  isBookingLoading : boolean
  booking : BookingType | null
  bookings : BookingType[]
  error : string | null
  message : string
  createBooking : (listingId?:string, booking?: Omit<BookingType, "createdAt" | "_id">) => void
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
     set({booking: response?.data?.booking, isBookingLoading:false, message: response?.data?.message})
    } catch (error) {
    const err  = errorHandler({error, defaultErr :"BOOKING_FAILED"})
    set({isBookingLoading:false, error:err})
    throw error;
    }
    }
 }))