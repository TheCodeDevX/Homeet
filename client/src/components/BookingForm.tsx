

 import { useCallback, useEffect, useRef, useState, type FormEvent, type HTMLAttributes, type RefObject} from 'react'
import Button from './Button';
import Price from './Price';
import { DayPicker} from "react-day-picker";
import "react-day-picker/style.css";
import type { ApiData } from '../store/listingStore';
import { lightThemes, THEMES } from '../constants';
import { useThemeStore } from '../store/themeStore';
import { CalendarIcon, ChevronDown, Loader } from 'lucide-react';
import CloseButton from './CloseButton';
import CounterBtn from './CounterBtn';
import i18n from '../config/reacti18next';
import { t } from 'i18next';
import {motion} from 'framer-motion'
import {addDays, format, isAfter, isBefore, isEqual, startOfDay} from 'date-fns'
import { useBookingStore, type BookingType } from '../store/bookingStore';
import clsx from 'clsx';
import { ar, enUS, es, fr } from 'date-fns/locale';
import { useAuthStore } from '../store/authStore';
import type { CurrencyCode } from '../types/types';
import MakeOfferForm from './Forms/MakeOfferForm';
import toast from 'react-hot-toast';
import ToasterCompo from './Toaster';
import { convertPrice } from '../utils/convertPrice';
import { fetchCurrenciesWithRates } from '../utils/fetchCurrenciesWithRates';

interface BookingFormProps extends HTMLAttributes<HTMLDivElement> {
    listing : ApiData | null
    handleClick: () => void;
}
type CalendarField =  "checkIn" | "checkOut" | null
type GuestField = "adults" | "children" | "pets"
interface CalendarDropDownProps {
   field: CalendarField
    selected?: Date
    onSelect: (d?: Date) => void
    disabled?: (d: Date) => boolean
    fromDate?: Date
    ref : RefObject<HTMLDivElement | null>
}

 const BookingForm = ({listing, handleClick } : BookingFormProps) => {
  
    const {theme} = useThemeStore()
    const [currencies, setCurrencies] = useState<{
    rate: number;
    code: CurrencyCode;
    symbol: string;
    name: string;
}[]>([])
    const [formState, setFormState] = useState({
      adults : 0,
      children : 0,
      pets : 0,
    });
    const [totalPrice, setTotalPrice] = useState(0)
    const [numberOfMonths, setNumberOfMonths] = useState<string | number>(0);
    const [duration, setDuration] = useState<{months:number, nights: number}>({ months : 0, nights : 0 })

    const [isOpen, setIsOpen] = useState(false)
    const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
    const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
    const {createBooking, isBookingLoading} = useBookingStore()
    const {user} = useAuthStore()
    const calendarRef = useRef<HTMLDivElement>(null)
    const [offerPrice, setOfferPrice] = useState<{amount_usd?: number, amount_local : number | string, currency : CurrencyCode}>();
    const [message, setMessage] = useState("");
    const isMonthly  = listing?.pricingType === "monthly"
    const isOneTime  = listing?.pricingType === "one_time"


    const ref = useRef<HTMLDivElement>(null)



    const lang = i18n.language;

    const userCurrency = user?.currency?.toUpperCase()as CurrencyCode
    
  useEffect(() => {
  const fetchCurrencies = async () => {
    const currencies = await fetchCurrenciesWithRates(userCurrency)
    setCurrencies(currencies ?? [])
  }
  fetchCurrencies()
  }, [userCurrency])

       useEffect(() => {
        const onClose = (e: MouseEvent) => {
         if(!ref.current?.contains(e.target as Node)) {
          setIsOpen(false)
         }
        }
  
        document.addEventListener("mousedown", onClose)
        return () => document.removeEventListener("mousedown", onClose)
  }, [])

 
const getDaysInMonth = useCallback((year:number, month:number) => {
  return new Date(year, month, 0).getDate()
}, [])


 useEffect(() => {
  if(checkIn) {
  // get date info
  let year = new Date(checkIn).getFullYear() // get current year
  let month = new Date(checkIn).getMonth() // get current month
  let day = new Date(checkIn).getDate() // get current month's day: "2025/11/12" => 12 is current month's day
  if(+numberOfMonths > 0) {
  for(let m = 0; m < +numberOfMonths; m++){
  const daysInCurrentMonth = getDaysInMonth(year, month + 1) // add 1 since month should start 1 for new Date(y,m,d)
  // add current month's days to current day : example (12 is the current month's day; 31 represents month's days)
  day += daysInCurrentMonth;
  // normalize overflow into next month
  while(day > daysInCurrentMonth){
  day -= daysInCurrentMonth;
  month++;
  // when month becomes december you should move into next year and set month to 0 (Jan) 
  if(month > 11) {month = 0; year++;}
  }
  }
   const checkOutDate = new Date(year, month, day)
   setCheckOut(checkOutDate)
  }
  }  
  }, [numberOfMonths, checkIn])


 


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(isOneTime) {
    if(!offerPrice?.amount_local) {
    toast.custom((toast) => (
     <ToasterCompo color="red" msg={t("clientMessages.REQUIRED_OFFER_PRICE", {ns:"messages"})} t={toast}/>
     ))
      return
    }
    if(!offerPrice?.currency) {
      toast.custom((toast) => (
     <ToasterCompo color="red" msg={t("clientMessages.REQUIRED_CURRENCY", {ns:"messages"})} t={toast}/>
     ))
      return
    }
    const OfferPrice = {
        currency:offerPrice.currency,
        amount_local:offerPrice.amount_local,
        amount_usd: convertPrice(+offerPrice.amount_local, offerPrice.currency, "USD", currencies)
      }
      console.log("offerPrice", OfferPrice, currencies)
    try {
      await createBooking(listing?._id, {offerPrice : OfferPrice , message} as BookingType<"one_time">)
    } catch (error) {
      console.error(error);
    }
    } else {
    if(!checkIn) {
      toast.custom((toast) => (
      <ToasterCompo color="red" msg={t("clientMessages.REQUIRED_CHECKIN", {ns:"messages"})} t={toast}/>
      ))
      return
    }
    if(!checkOut) {
      toast.custom((toast) => (
      <ToasterCompo color="red" msg={t("clientMessages.REQUIRED_CHECKOUT", {ns:"messages"})} t={toast}/>
      ))
    return
    }
    const dates : {checkIn : string, checkOut?: string} = {
      checkIn: format(checkIn, "yyy/MM/dd"),
      checkOut: format(checkOut, "yyy/MM/dd")
     }
     const dur = listing?.pricingType === "nightly" ? duration.nights : duration.months
     try {
       if (!(dates.checkIn || dates.checkOut) && listing?.pricingType !== "one_time") return;
        const currency = user?.currency?.toUpperCase() as CurrencyCode | undefined
        if(!currency) {
        toast.custom((toast) => (
        <ToasterCompo color="red" msg={t("clientMessages.REQUIRED_CURRENCY", {ns:"messages"})} t={toast}/>
        ))
        return
        } 
        const costPrice = {
          amount_local:totalPrice,
          amount_usd:convertPrice(totalPrice, currency, 'USD', currencies),
          currency
        }
        console.log('cost price', costPrice)
      await createBooking(listing?._id, {...formState, ...dates, duration:dur, costPrice})
     } catch (error) {
      console.log(error)
     }
    }
    
  }


  useEffect(() => {
  const pricingType = listing?.pricingType;
  const price = listing?.price;

  if(pricingType && price && checkOut && checkIn) {
   const handlePrice = () => {
    const end = new Date(checkOut)
    const start = new Date(checkIn)
     const startYear = start.getFullYear()
    const endYear = end.getFullYear()
    const startMonth = start.getMonth()
    const endMonth = end.getMonth()
    
    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth)
       switch(pricingType) {
       case "monthly" : 
       setDuration((prev) => ({...prev, months : totalMonths }))
       if(numberOfMonths === 0) return "0";
       return totalMonths * +price.amount_local;
      

       case "nightly" : {
       const nights = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
       setDuration((prev) => ({...prev, nights : +nights.toFixed(0) }))
       if(nights <= 0 || !checkOut || !checkIn) return "0";
       const result = nights * +price.amount_local
       return result;
       } // wrap it in curly braces since it has const
      
      default : return
    };
    };
    const finalPrice = handlePrice();
    if(!finalPrice) return;
    if(finalPrice === "0") {
    }
    
    setTotalPrice(+(finalPrice === "0" ? 0 : finalPrice.toFixed(2)));
   }


  }, [checkOut, checkIn, numberOfMonths, listing?.pricingType, listing?.price])




const today = startOfDay(new Date())
const getLocale = () => {
  if(lang === "ar") return ar
  if(lang === "en") return enUS
  if(lang === "fr") return fr
  if(lang === "es") return es
}
const locale = getLocale()
const [openCalendar, setOpenCalendar] = useState<CalendarField>(null)


  // helpers 
  const formatDate = (d?:Date) => d ? format(d, 'yyyy/MM/dd', {locale}) : undefined;
  // handlers
  const handleCheckInSelect = (d?:Date) => {
    if(!d) return;
    if(checkOut && (isAfter(d, checkOut) || isEqual(d, checkOut))) {
      setCheckOut(undefined)
      setTotalPrice(0);
    }
    setCheckIn(d)
    setOpenCalendar("checkOut")
  }

  const handleCheckOutSelect = (d?:Date) => {
    if(!d || !checkIn) return;
    setCheckOut((checkIn && isEqual(d,checkIn) && !isBefore(d,today)) ? addDays(d,1) : d)
    setOpenCalendar(null)
  }

  const counter = ({key, delta} : {key:GuestField, delta : -1 | 1}) =>
  setFormState(prev => ({...prev, [key]:Math.max(0, prev[key] + delta)}))

  useEffect(() => {
    const handleClickOutside = (e:MouseEvent) => {
    if(!calendarRef.current) return;
    if(!((calendarRef?.current as Node)?.contains(e.target as Node))) {
     setOpenCalendar(null)
    }
    }
    document.addEventListener("mousedown", handleClickOutside );
    return () => document.removeEventListener("mousedown", handleClickOutside )
  }, [])

  const DateInput = ({field, value, placeholder} : {field:CalendarField, value: string, placeholder:string}) => {
    return (
      <button
      type="button"
      onClick={() => setOpenCalendar(prev => prev === field ? null : field)}
      className={`input input-bordered rounded-lg w-full text-sm text-left flex items-center justify-between
        ${openCalendar === field ? "ring-2 ring-primary/30 border-primary" : ""}`}
    >
      <span className={value ? "" : "opacity-40"}>{value ?? placeholder}</span>
      <CalendarIcon className="size-4 opacity-40 shrink-0"/>
    </button>
    )
  }

  const CalendarDropDown = ({field, selected, onSelect, disabled, fromDate, ref} : CalendarDropDownProps ) => {
   if(openCalendar !== field || (field === "checkOut" && !checkIn)) return null
    return (
      <div ref={ref}
     className="absolute z-[999990] w-full flex items-center justify-center top-full mt-1 left-0
        bg-base-100 border border-base-content/10 rounded-xl shadow-md p-2 h-auto">
        <DayPicker 
          mode="single"
          selected={selected}
          onSelect={onSelect}
          disabled={disabled}
          fromDate={fromDate ?? today}
          locale={locale}
          dir={lang === "ar" ? "rtl" : "ltr"}
           classNames={{
             day: "w-[55px] p-1 max-xss:text-xs",
             day_button: "w-full aspect-square",
             day_selected: "!bg-primary !text-primary-content !font-medium"
            
    }}
        
        />
      </div>
    )
  }


return (
<>
<div className={clsx(
  "absolute mt-24 2xl:mx-4 2xl:mt-[calc(6rem+2rem)] m-0 2xl:w-[400px] w-[90%] max-w-md",
  "bg-base-300 p-5 rounded-xl"
)}>
  <CloseButton handleClose={handleClick}/>
  <Price isDynamic={listing?.pricingType !== "one_time"} price={totalPrice} listing={listing}/>

  {lightThemes.includes(theme) && (
    <style>{`
      .flatpickr-calendar {
        background: ${THEMES.find(t => t.name === theme)?.colors[0]} !important;
      }
    `}</style>
  )}

 { isOneTime
  ? <MakeOfferForm handleSubmit={handleSubmit}   
      setOfferPrice={setOfferPrice}
      currencies={currencies}
      offerPrice={offerPrice}
      user={user}
      message={message}
      setMessage={setMessage}
      isBookingLoading={isBookingLoading}/>
   : <form onSubmit={handleSubmit} className="mt-4 space-y-3">
    {/* Check-in */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide opacity-60">
        {t("labels.checkIn", {ns: 'common'})}
      </label>
     <div className="relative">
       <DateInput
      field="checkIn"
      placeholder={t("placeholders.checkIn", {ns: 'common'})}
      value={formatDate(checkIn) ?? ''}
      />
      <CalendarDropDown
      ref={calendarRef}
      field="checkIn"
      selected={checkIn}
      onSelect={handleCheckInSelect}
      fromDate={today}
      disabled={(d) => isBefore(d, today)}
      />
     </div>
    </div>

    {/* Check-out / Months / nothing for one_time */}
    {isMonthly ? (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wide opacity-60">
          {t("placeholders.months", {ns: 'common'})}
        </label>
        <div className="relative">
          <input
            name="months"
            type="number"
            value={numberOfMonths}
            onChange={({target: {value}}) =>
              setNumberOfMonths(/^0/.test(value) ? value.replace(/^0/, '') : +value)
            }
            className={`input input-bordered rounded-lg w-full text-sm ${lang === "ar" ? "pl-20" : "pr-20"}`}
          />
          <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1
            ${lang === "ar" ? "left-2" : "right-2"}`}>
            { +numberOfMonths > 0 && <button
              type="button"
              onClick={() => setNumberOfMonths(prev => prev === 0 ? 0 : +prev - 1)}
              className={`w-7 h-7 flex items-center justify-center rounded-full
                border border-base-content/15 hover:bg-base-100
                text-sm transition-colors select-none
               `}
            >−</button>}
            <button
              type="button"
              onClick={() => setNumberOfMonths(prev => +prev + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full
                border border-base-content/15 bg-base-200 hover:bg-base-100
                text-sm transition-colors select-none cursor-pointer"
            >+</button>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wide opacity-60">
          {t("labels.checkOut", {ns: 'common'})}
        </label>

      <div className="relative">
       <DateInput
      field="checkOut"
      placeholder={t("placeholders.checkOut", {ns: 'common'})}
      value={formatDate(checkOut) ?? ''}
      />
      <CalendarDropDown
      ref={calendarRef}
      field="checkOut"
      selected={checkOut}
      onSelect={handleCheckOutSelect}
      fromDate={today}
      disabled={(d) => isBefore(d, checkIn ?? today)}
      />
     </div>
         
      </div>
    )}

    {/* Guests */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide opacity-60">
        {t("labels.guests", {ns: "common"})}
      </label>
      <div ref={ref} className="relative">
        <div
        
          onClick={() => setIsOpen(prev => !prev)}
          className={clsx("input input-bordered rounded-lg w-full text-sm text-left",
            "flex items-center justify-between cursor-pointer",
            lang === "ar" ? "pr-2" : "pr-10",
            isOpen ? "ring-2 ring-primary/30 border-primary" : ""
          )} 
        >
          <ChevronDown className={`absolute transition-transform duration-150
            ${lang === "ar" ? "left-3" : "right-3"}
            top-1/2 -translate-y-1/2 opacity-50 size-4`}
          />
          {t("labels.guestContent", {
            ns: "common",
            adults: formState.adults || 0,
            children: formState.children || 0,
            pets: formState.pets || 0,
          })}
        </div>

        <motion.div
          initial={{opacity: 0, visibility: "hidden"}}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? "4px" : "12px",
            visibility: isOpen ? "visible" : "hidden",
          }}
          transition={{duration: 0.1}}
          className={clsx("absolute top-full mt-1 w-full z-[999990]",
            "bg-base-100 border border-base-content/10 rounded-xl shadow-sm py-2",
          )}
        >
          {(([
            {key: "adults",   label: t("labels.adults",   {ns: "common"})},
            {key: "children", label: t("labels.children", {ns: "common"})},
            {key: "pets",     label: t("labels.pets",     {ns: "common"})},
          ]) as {key: GuestField, label: string}[]).map(({key, label}, i, arr) => (
            <div key={key}
              className={`flex items-center justify-between px-4 py-3 text-sm
                ${i < arr.length - 1 ? "border-b border-base-content/5" : ""}`}
            >
              <span className="font-medium">{label}</span>
              <div className={clsx("flex items-center gap-3")}>
                <CounterBtn
                 disabled={formState[key] === 0} type2 btnType="decrement" onClick={() => counter({key, delta:-1})}/>
                <span className="w-4 text-center tabular-nums">{formState[key]}</span>
                <CounterBtn
                disabled={listing ? formState[key] >= +listing[key] : false}
                 type2 btnType="increment" onClick={() => counter({key, delta :1}) }/>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>

    <Button type="submit" classes="w-full !mt-5">
      {isBookingLoading
        ? <Loader className="animate-spin mx-auto size-4"/>
        : <span className="text-sm font-medium">{t("buttons.book", {ns: "common"})}</span>
      }
    </Button>
  </form>}
</div>
</>
   )
 }
 
 export default BookingForm
 