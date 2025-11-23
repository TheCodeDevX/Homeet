

 import React, { useEffect, useRef, useState } from 'react'
 import {motion} from "framer-motion"
import { lightThemes } from '../constants'
import { useThemeStore } from '../store/themeStore'
import { Check, X, type LucideIcon } from 'lucide-react'
import type { Toast } from 'react-hot-toast'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/all'
import i18n from '../config/reacti18next'

 
 const ToasterCompo = ({color, msg, t} : {color : "green" | "red", msg : string, t:Toast}) => {
    const {theme} = useThemeStore()
   const [toastId, setToastId] = useState("")

    const isSuccess = color === 'green';
    const container = useRef<HTMLDivElement>(null)
    const paraRef = useRef<HTMLParagraphElement>(null)
    const iconRef = useRef<SVGSVGElement | null>(null)
    const langugae = i18n.language;
   gsap.registerPlugin(SplitText)
   const isArabic = langugae === "ar"

    useGSAP(() => {  
      const tl = gsap.timeline();
      // const splitedMessage = new SplitText(paraRef.current,
      //    {type:` ${isArabic ? "words, lines" : "chars, words, lines"}  `})
      
      //  tl.from((isArabic ? splitedMessage.words : splitedMessage.chars), {
      //  stagger: {amount:0.3},
      //  ease:"expo.inOut",
      //  duration:0.2,
      //  opacity:0,
      
      // })
      tl.fromTo(container.current, {opacity:0, scale:0},
         { opacity:1, scale:1, ease:"back.out", duration:1}, "<")
      tl.to(iconRef.current, {scale:isSuccess ? 2 : 1.5, ease:"circ", duration:0.5})
      .to(iconRef.current, {scale:1, ease:"circ", duration:0.5})
     
     
     
    }, {dependencies:[msg]})
   return (
      <motion.div
      initial={{y:-40, opacity:0}}
       transition={{duration:1, type:"spring", damping:40, stiffness:200}}
      animate={{ y : t.visible ? 0 : -40, opacity: t.visible ? 1 : 0 }}
     className={`flex flex-col`}>
    
   <div className={`flex justify-center`}>
     <div className={`${lightThemes.includes(theme) ? "bg-white" : "bg-base-300"}
      border ${color === "green" ? "border-green-500/50 shadow-[inset_1px_1px_10px_rgba(0,128,0,0.1),1px_1px_10px_rgba(0,128,0,0.5),1px_1px_10px_rgba(225,225,225,0.25)]"  :
      "border-red-500/50 shadow-[inset_1px_1px_10px_rgba(225,0,0,0.1),1px_1px_10px_rgba(225,0,0,0.5),1px_1px_10px_rgba(225,225,225,0.25)]"} px-9 py-3 rounded-xl 
      
   
    flex items-center justify-center text-center gap-2`}>

     <div ref={container} className={`p-2 bg-transparent ${color === "green" ?
      "text-green-500 border-green-500/50" : "text-red-500 border-red-500/50"}
      w-[30px] h-[30px] flex items-center justify-center
     rounded-full border`}>{color === "green" ? <Check ref={iconRef}/> : <X  ref={iconRef} id='icon'/>}</div> 
     
      <p ref={paraRef} className={`${color === "green" ? "text-green-500" : "text-red-500"}
         flex items-center text-xs font-semibold`}>{msg}</p>
   </div>
   </div>
 </motion.div>
   )
 }
 
 export default ToasterCompo
 