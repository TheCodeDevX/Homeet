import type { ButtonHTMLAttributes } from "react"
import i18n from "../config/reacti18next"
import clsx from "clsx"

  type Btntype = "increment" | "decrement" 

  interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {btnType : Btntype, type2?:boolean}

 const CounterBtn = ({btnType, type2, ...props} : BtnProps ) => {
  const lang = i18n.language
   return (
    <>
    {type2 ? <button
    {...props}
     type="button" 
         className={clsx("w-8 h-8",
         "rounded-full border",
         "transition-colors duration-200",
         props.disabled ? "border-base-content/10 cursor-not-allowed" 
         : "cursor-pointer bg-primary/10 text-primary border-primary/20 hover:border-primary-content/20 hover:bg-primary hover:text-primary-content"
          )}>
          <span>{btnType === "increment" ? "+" : "-"}</span>
          
 </button>
 : 
 <button
    {...props}
     type="button" 
         className={
          `absolute ${btnType === "increment" 
          ? (lang === "ar" ? "left-2" : "right-2") 
          : btnType === "decrement" && (lang === "ar" ? "left-12" : "right-12")
          
          }
        
         w-8 h-8 top-1/2 -translate-y-1/2 hover:bg-base-100
         rounded-full bg-neutral text-neutral-content border hover:text-base-content
          border-base-content/15 hover:border-base-content transition-colors duration-200`}>
          <span>{btnType === "increment" ? "+" : "-"}</span>
          
 </button>}
    </>
    
   )
 }
 
 export default CounterBtn
 