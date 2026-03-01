

 import { useCallback, useEffect, useRef, useState, type ChangeEvent, type Dispatch, type FormEvent, type HTMLAttributes, type RefObject, type SetStateAction } from 'react'
import Button from './Button';
import Price from './Price';
import FlatPickr from 'react-flatpickr'
import type { ApiData } from '../store/listingStore';
import { lightThemes, THEMES } from '../constants';
import { useThemeStore } from '../store/themeStore';
import { ChevronDown, Loader } from 'lucide-react';
import CloseButton from './CloseButton';
import CounterBtn from './CounterBtn';
import i18n from '../config/reacti18next';
import { t } from 'i18next';
import {motion} from 'framer-motion'
import {format} from 'date-fns'
import { useBookingStore } from '../store/bookingStore';

interface DatePickerProps extends HTMLAttributes<HTMLDivElement> {
    listing : ApiData | null
    // containerTwo?: RefObject<HTMLDivElement | null>
    checkIn : string | undefined
    checkOut : string | undefined
    handleClick: () => void;
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

 const DatePicker = ({listing, selectedDateRef, handleClick } : DatePickerProps) => {
    const {theme} = useThemeStore()
    const [formState, setFormState] = useState({
      adults : 0,
      children : 0,
      pets : 0,
    });
    const [totalPrice, setTotalPrice] = useState(0)
    const [numberOfMonths, setNumberOfMonths] = useState(0);
    const [duration, setDuration] = useState<{months?:number, nights?: number}>({ months : 0, nights : 0 })

    const [isOpen, setIsOpen] = useState(false)
    const [_refreshKey, setRefreshkey] = useState(0);
     const {createBooking, isBookingLoading} = useBookingStore()

    const ref = useRef<HTMLDivElement>(null)



    const lang = i18n.language;

    const handleChange = (e : ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value, name } = e.target;
    setFormState((prev) => ({...prev, [name] : /^0/.test(value) ? value.replace(/^0/, '') : +value }))
    }

       useEffect(() => {
        const onClose = (e: MouseEvent) => {
         if(!ref.current?.contains(e.target as Node)) {
          setIsOpen(false)
         }
        }
  
        document.addEventListener("mousedown", onClose)
        return () => document.removeEventListener("mousedown", onClose)
  }, [])

 
const months = useCallback(() => [
  { days:0 },
  { days: 31 },   // January
  { days: 28 },   // February
  { days: 31 },   // March
  { days: 30 },   // April
  { days: 31 },   // May
  { days: 30 },   // June
  { days: 31 },   // July
  { days: 31 },   // August
  { days: 30 },   // September
  { days: 31 },   // October
  { days: 30 },   // November
  { days: 31 }    // December
], []);

   useEffect(() => {
    if(selectedDateRef.current.checkIn && numberOfMonths) {
     const days : number[] = [];

    for(let m = 0; m <= numberOfMonths; m++){
     days.push(months()[m]?.days)
    };
      const allDays = days.reduce((acc, days) => acc + days, 0)
      console.log(allDays, 'allDays') 
     selectedDateRef.current.checkOut = undefined;

     if(numberOfMonths > 0 && listing?.pricingType !== "one_time") { 
     const checkOut = new Date(new Date(selectedDateRef.current.checkIn).getTime() +
     (1000 * 60 * 60 * 24 * allDays))
      selectedDateRef.current.checkOut = format(checkOut, "yyyy/MM/dd");
    }
    }

    console.log("checkOutDate", selectedDateRef.current.checkOut)
   }, [numberOfMonths, months, listing?.pricingType, selectedDateRef])

      const checkIn = selectedDateRef.current.checkIn || sessionStorage.getItem('checkIn')
      const checkOut = selectedDateRef.current.checkOut || sessionStorage.getItem('checkOut')
   
  useEffect(() => {
    if(checkIn && checkOut) {
      const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
      const numberOfDays = +(diff / (1000 * 60 * 60 * 24)).toFixed(0);
      setFormState((prev) => ({...prev, dayLength:numberOfDays}))
       console.warn(numberOfDays, 'num of days')  
    }
   }, [checkIn, checkOut, numberOfMonths])



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dates : {checkIn : string, checkOut?: string} = {
      checkIn : selectedDateRef.current.checkIn ?? sessionStorage.getItem("checkIn") ?? "",
      checkOut : listing?.pricingType === "one_time" ? undefined : selectedDateRef.current.checkOut 
      ?? sessionStorage.getItem("checkOut")  ?? "",         
     }

     const data = {...formState,...dates, duration, totalPrice};
     try {
      if(!dates.checkIn && listing?.pricingType === "one_time") return;
       if (!(dates.checkIn || dates.checkOut) && listing?.pricingType !== "one_time") return;
      await createBooking(listing?._id, data)
     } catch (error) {
      console.log(error)
     }
  }


  useEffect(() => {
  const pricingType = listing?.pricingType;
  const price = listing?.price;
  if(pricingType && price && checkOut && checkIn) {
   const handlePrice = () => {
    let diff = new Date(checkOut).getTime() - new Date(checkIn).getTime() 
       switch(pricingType) {
       case "monthly" : 
       diff = diff / ( 1000 * 60 * 60 * 24 * 30)
       setDuration((prev) => ({...prev, months : +diff.toFixed(0) }))
       if(numberOfMonths === 0) return "0";
       return diff * price;
      

       case "nightly" : {
       diff = diff / ( 1000 * 60 * 60 * 24);
       setDuration((prev) => ({...prev, nights : +diff.toFixed(0) }))
       if(diff <= 0 || !checkOut || !checkIn) return "0";
       const result = diff * price
       return result;
       } // wrap it in curly braces since it has const
      
      default : return undefined;
    };
    };
    const finalPrice = handlePrice();
    if(!finalPrice) return;
    setTotalPrice(+(finalPrice === "0" ? 0 : finalPrice.toFixed(2)));
   }


  }, [checkOut, checkIn, numberOfMonths, listing?.pricingType, listing?.price])



   return (
    <>
      

    <div className={"w-full"}>
     <CloseButton handleClose={handleClick}/>
       <Price isDynamic={listing?.pricingType === "one_time" ? false : true}
        key={totalPrice} price={totalPrice < 0 ? 0 : totalPrice} listing={listing}/>
      <form onSubmit={handleSubmit} className="w-full flex flex-col">
        <div className="w-full">
        <span className="mb-2 md:text-md text-sm">{t("labels.checkIn", {ns : 'common'})}</span>
       <FlatPickr value={selectedDateRef.current.checkIn}
         className="input flex text-left placeholder:text-left w-full text-sm" 
        // placeholder="check-in"
       
        onChange={(dates: Date[]) => {
          console.log(dates, 'onchange for checkIn') // [Wed Dec 17 2025 12:00:00 GMT+0100 (GMT+01:00)]
          const date = format(dates[0], "yyyy/MM/dd") // local time
          sessionStorage.setItem("checkIn", date)
          selectedDateRef.current.checkIn = date
          console.log(date, 'iso') // ISO : 2025-12-15T11:00:00.000Z,
          // new Date() : Dec 16 2025 14:36:00 GMT+0100 (GMT+01:00)
        }}

        onClose={() => setRefreshkey(prev => prev + 1)}
        options={{
          closeOnSelect: false,
          disableMobile:true,
          // enableTime:true,
          dateFormat: "Y/m/d",
          minDate: "today",
          maxDate: (listing?.pricingType === "monthly") ? undefined 
          : sessionStorage.getItem("checkOut") || selectedDateRef.current.checkOut ||  undefined,
         // flatPickr automatically converts the target time to the regional time.

          // maxDate: new Date(Date.now() + 1000 * 60 * 60 * 24) // one day plus from now.
          // disable: [new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)] // The third day from now is disabled.
          // disable : [
          //   {from : "2025-12-13", to: "2025-12-29"},
          //   function(date) {
          //     return (date.getDay() === 1 || date.getFullYear() === 2026); // 0 is sunday and 1 is monday
          //   }
          // ],

          // enable: [new Date()], // enable specific dates and disable the rest.
          // mode:"range",
          // defaultDate: [new Date(checkIn || Date.now())] 
          // conjunction: "tooo" // for "multiple" mode.
        }}/>
       </div>
        <div className="w-full flex flex-col">
       { lightThemes.includes(theme) && <style>
         {`
          .flatpickr-calendar {
            background : ${THEMES.find(t => t.name === theme)?.colors[0]} !important;
            
          }
        
         `}
        </style>}
    { listing?.pricingType === "monthly" 
    ? 
   
     <div>
      <span className="mb-2 md:text-md text-sm">{t("placeholders.months", {ns : 'common'})}</span>
      <label className="flex flex-col relative">
        <input name='months' type="number" value={numberOfMonths} 
        onChange={handleChange} min={0}  
        max={12}
         className={`input input-bordered ${lang === "ar" ? "pr-2" : "pr-28"}`} />
      
        <div onClick={() => setNumberOfMonths(prev => prev === 12 ? 12 : prev + 1)}
         className={`w-8 h-8 z-[10] cursor-pointer absolute flex justify-center items-center top-1/2 -translate-y-1/2 hover:bg-base-100
         rounded-full bg-neutral text-neutral-content border hover:text-base-content
          border-base-content/15 hover:border-base-content transition-colors duration-200 select-none
          ${lang === "ar" ? "left-2" : "right-2" }
          `}>+</div>

        <div onClick={() => setNumberOfMonths(prev => prev === 0 ? 0 : prev - 1)}
         className={`w-8 h-8 z-[10] absolute flex justify-center items-center top-1/2 -translate-y-1/2 hover:bg-base-100
         rounded-full bg-neutral text-neutral-content border hover:text-base-content
          border-base-content/15 hover:border-base-content transition-colors duration-200 select-none
          ${lang === "ar" ? "left-12" : "right-12" } ${numberOfMonths === 0 ? 'cursor-not-allowed opacity-10' : 'cursor-pointer'}
          `}>-</div>
        

        
      </label>
    </div>
    : listing?.pricingType === "one_time" ? 
     <></>
    : <div>
        <span className="mb-2 md:text-md text-sm">{t("labels.checkOut", {ns : 'common'})}</span>
     <FlatPickr className="input flex text-left placeholder:text-left w-full text-sm " 
        // placeholder="Check-out"
         value={checkOut?.toString()}
        onChange={(dates: Date[]) => {
          console.log(dates, 'onchange for checkOut') // [Wed Dec 17 2025 12:00:00 GMT+0100 (GMT+01:00)]
         const date = format(dates[0], "yyyy/MM/dd")
          if(selectedDateRef.current.checkIn) {
            if(new Date(selectedDateRef.current.checkIn) >= new Date(date)) return;
          }
          sessionStorage.setItem("checkOut", date)
          selectedDateRef.current.checkOut = date
          // setCheckInRefreshKey(prev => prev + 1)


          // setSelectedDate((prev) => ({...prev, checkIn : selectedDateRef.current.checkIn}));

          console.log(date, 'iso') // 2025-12-15T11:00:00.000Z
          console.log(new Date(date), 'new Date(iso)') // Tue Dec 23 2025 12:08:00 GMT+0100 (GMT+01:00)

  }
  }
        onClose={() => setRefreshkey(prev => prev + 1)}
       
        options={{
          closeOnSelect: false,
          disable : [new Date(selectedDateRef?.current?.checkIn ?? "")],
          // enableTime:true,
          dateFormat: "Y/m/d",
          minDate:sessionStorage.getItem("checkIn") || selectedDateRef.current.checkIn || "today"

          

          // maxDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // one day plus from now.
          // disable: [new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)] // The third day from now is disabled.
          // disable : [
          //   {from : "2025-12-13", to: "2025-12-29"},
          //   function(date) {
          //     return (date.getDay() === 1 || date.getFullYear() === 2026); // 0 is sunday and 1 is monday
          //   }
          // ],

          // enable: [new Date()], // enable specific dates and disable the rest.
          // mode:"range",
          // defaultDate: [new Date(checkOut || Date.now())] // preload./
          // conjunction: "tooo" // for "multiple" mode.

      }}/>
    </div>  }
   <div>
         <span className="mb-2 md:text-md text-sm">{t("labels.guests", {ns:"common"})}</span>
        <div ref={ref} className="flex flex-col relative">
        <div  onClick={() => setIsOpen(prev => !prev)}
        className={`input flex items-center cursor-pointer relative ${lang === "ar" ? "pr-2" : "pr-28"}`} >

        <ChevronDown className={`absolute ${!isOpen ? "rotate-0" : "rotate-180"} 
        ${lang === "ar" ? "left-2" : "right-2"}
          top-1/2 -translate-y-1/2 stroke-[1.5px] size-[20px] transition-all duration-100`}/>
       {t("labels.guestContent", {ns:"common",
         adults : formState.adults || listing?.adults || 0,
         children : formState.children || listing?.children || 0,
         pets: formState.pets || listing?.pets || 0 
       })}
        </div>

        { <motion.div 
        initial={{opacity:0, visibility:"hidden"}}
        animate={{
        opacity: isOpen ? 1 : 0,
        y: isOpen  ? "5%" : "10%",
        visibility : isOpen ? "visible" : "hidden"
      }}
         className='w-full bg-base-100 py-4 px-2
          border border-base-content/10 rounded absolute z-[999990] top-full'>
           
           <div className='p-4 relative'> 
            
            <div className="flex items-center justify-between">
              <span>{t("labels.adults", {ns:"common"})}</span>
            
              <div className='flex items-center gap-2'>
               <CounterBtn type2 btnType="decreasement" onClick={() =>
                 setFormState((prev) => ({...prev, adults : prev.adults > 0 ? prev.adults - 1 : 0 }))}/>
               <span> {formState.adults} </span>
               <CounterBtn type2 btnType="increasement" onClick={() =>
                 setFormState((prev) => ({...prev, adults : prev.adults + 1
                  }))}/>
              </div>
            </div>
         
            </div>

              <div className='p-4 relative'> 
            
            <div className="flex items-center justify-between">
              <span>{t("labels.children", {ns:"common"})}</span>
            
              <div className='flex items-center gap-2'>
              { <CounterBtn type2 btnType="decreasement" className={``} onClick={() =>
                 setFormState((prev) => ({...prev, children : prev.children > 0 ? prev.children - 1 : 0 }))}/>}
               <span> {formState.children} </span>
               <CounterBtn type2 btnType="increasement" onClick={() =>
                 setFormState((prev) => ({...prev, children : prev.children + 1 }))}/>
              </div>
            </div>
         
            </div>

          <div className='p-4 relative'> 
            <div className="flex items-center justify-between">
             <span>{t("labels.pets", {ns:"common"})}</span>
              <div className='flex items-center gap-2'>
                <CounterBtn type2 btnType="decreasement" onClick={() =>
                  setFormState((prev) => ({...prev, pets : prev.pets > 0 ? prev.pets - 1 : 0 }))}/>
                <span> {formState.pets} </span>
                <CounterBtn type2 btnType="increasement" onClick={() =>
                  setFormState((prev) => ({...prev, pets : prev.pets + 1 }))}/>
              </div>
            </div>
          </div>
         </motion.div>
         }
      </div>
       
       </div>
       </div>

    <Button type="submit" classes='!mt-4'>
       {!isBookingLoading ? (<>
                       {t("buttons.checkAvailability", {ns : "common"})}
                    </>) : (
        <><Loader className="animate-spin text-center mx-auto size-5"/></>
                 )}
      </Button>

      
 
      </form>
      
      
    </div>

       
    </>
   )
 }
 
 export default DatePicker
 