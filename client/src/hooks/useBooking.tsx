import { BookingContext } from "../context/BookingProvider"
import { customContext } from "../utils/customContext"


 
 const useBooking = () => {
    return customContext(BookingContext, "useBooking");
 }
 
 export default useBooking
 