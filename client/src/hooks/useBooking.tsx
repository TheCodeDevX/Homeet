import { BookingContext } from "../context/BookingProvider"
import { useCustomContext } from "../utils/useCustomContext"


 
 const useBooking = () => {
    return useCustomContext(BookingContext, "useBooking");
 }
 
 export default useBooking
 