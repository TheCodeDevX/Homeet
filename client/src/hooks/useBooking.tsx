import { BookingContext } from "../context/createdContexts/BookingContext";
import { useCustomContext } from "../utils/useCustomContext"


 
 const useBooking = () => {
    return useCustomContext(BookingContext, "useBooking");
 }
 
 export default useBooking
 