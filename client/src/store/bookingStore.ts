import { isAxiosError } from "axios";
import { create } from "zustand";
import { BookingApi } from "../lib/axios.config";

 interface BookingType {
    checkIn?: string,
    checkOut?: string,
    adults : number,
    children : number,
    pets : number,
    createdAt?: string,
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
     set({booking: response.data.booking, isBookingLoading:false, message: response.data.message})

    } catch (error) {
    let errMsg = "error creating booking";
    if(isAxiosError(error)) {
        errMsg = error?.response?.data?.message || errMsg;
    } else if (error instanceof Error) {
        errMsg = error?.message || errMsg
    }
    set({isBookingLoading:false,error:errMsg})
    throw error;
    }
    }
 }))