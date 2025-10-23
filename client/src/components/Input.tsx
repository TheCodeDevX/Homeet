import clsx from 'clsx'
import type { ComponentType, InputHTMLAttributes, SVGProps } from 'react'
import i18n from '../config/reacti18next'
 interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: ComponentType<SVGProps<SVGSVGElement>>
    eyeIcon?: ComponentType<SVGProps<SVGSVGElement>>
    onClickEye?: () => void
    classes?:string
    iconClasses?:string
 }
 const Input = ({icon:Icon, eyeIcon:EyeIcon, onClickEye, classes, iconClasses, ...props} : InputProps) => {
  const lang = i18n.language
   return (
    <div className='relative'>
         <div className="relative mt-2">
        <div className={`absolute inset-y-0 ${lang === "ar" ?  "right-3" : "left-3"}
           flex items-center pointer-events-none`}>
        {Icon && <Icon className={`size-5 text-base-content/50 ${iconClasses}`}/>}
    </div>
        
    <input {...props} 
    className={clsx("w-full py-2 bg-base-100",lang === "ar"
       && !EyeIcon ? "!pr-10 !pl-5" : Icon ? "pl-10" : "pl-3",
       EyeIcon ? "pr-10" : "pr-3",
     classes,
    "rounded-lg border border-base-content/50 focus:outline-none placeholder-base-content/50 text-base-content",
    "focus:ring-offset-[4px] focus:ring-2 focus:ring-primary focus:ring-offset-base-300 transition select-none")} />
   
  </div> 
  { EyeIcon && <button type='button' onClick={onClickEye}
   className={`absolute ${lang === "ar" ? "left-3" :  "right-3"} inset-y-0 group`}>
    <EyeIcon className='size-5 text-base-content/50
  group-hover:text-base-content/80 transition-colors'/></button>}
    </div>
 
   )
 }
 
 export default Input