import { createContext, useMemo, useRef, useState, type Dispatch, type PropsWithChildren, type RefObject, type SetStateAction } from "react";


 export interface BookingStates {
  checkIn?:string
  checkOut?:string
  selectedDateRef : RefObject<{
    checkIn?: string | undefined;
    checkOut?: string | undefined;
}>
  setSelectedDate : Dispatch<SetStateAction<{checkIn?: string | undefined, checkOut?: string | undefined}>>
  selectedDate : {
    checkIn?: string | undefined;
    checkOut?: string | undefined;
  }
 }

 export const BookingContext = createContext<BookingStates | undefined>(undefined);

  export const BookingProvider = ({children} : PropsWithChildren) => {
    const intialDates = {
    checkIn : sessionStorage.getItem("checkIn") ||  new Date(Date.now()).toISOString(),
    checkOut : sessionStorage.getItem("checkOut") ||  new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    }

    // const [selectedDate, setSelectedDate] = useState<{checkIn?: string, checkOut?: string}>(() => ({...intialDates}))
    const [selectedDate, setSelectedDate] = useState<{checkIn?: string, checkOut?: string}>({})

    const selectedDateRef = useRef<{checkIn?:string | undefined, checkOut?:string | undefined}>
    ({checkIn:intialDates.checkIn, checkOut:intialDates.checkOut})



    return <BookingContext.Provider value={{checkIn:selectedDateRef.current.checkIn,
       checkOut:selectedDateRef.current.checkOut,
       selectedDateRef,
       setSelectedDate,
       selectedDate
    }}>
      {children}
    </BookingContext.Provider>
  }