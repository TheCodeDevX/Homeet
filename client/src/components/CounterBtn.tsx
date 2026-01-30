import type { ButtonHTMLAttributes } from "react"
import i18n from "../config/reacti18next"

  type Btntype = "increasement" | "decreasement" 

  interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {btnType : Btntype, type2?:boolean}

 const CounterBtn = ({btnType, type2, ...props} : BtnProps ) => {
  const lang = i18n.language
   return (
    <>
    {type2 ? <button
    {...props}
     type="button" 
         className={`w-8 h-8
         hover:bg-base-100
         rounded-full bg-neutral text-neutral-content border hover:text-base-content
          border-base-content/15 hover:border-base-content transition-colors duration-200`}>
          <span>{btnType === "increasement" ? "+" : "-"}</span>
          
 </button>
 : 
 <button
    {...props}
     type="button" 
         className={`absolute ${btnType === "increasement" 
          ? (lang === "ar" ? "left-2" : "right-2") 
          : btnType === "decreasement" && (lang === "ar" ? "left-12" : "right-12")
          
          }
          
             w-8 h-8 top-1/2 -translate-y-1/2 hover:bg-base-100
         rounded-full bg-neutral text-neutral-content border hover:text-base-content
          border-base-content/15 hover:border-base-content transition-colors duration-200`}>
          <span>{btnType === "increasement" ? "+" : "-"}</span>
          
 </button>}
    </>
    
   )
 }
 
 export default CounterBtn
 