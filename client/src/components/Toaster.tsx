

 import React from 'react'
 import {motion} from "framer-motion"
import { lightThemes } from '../constants'
import { useThemeStore } from '../store/themeStore'
import { Check, X } from 'lucide-react'
import type { Toast } from 'react-hot-toast'
 
 const ToasterCompo = ({color, msg, t} : {color : "green" | "red", msg : string, t:Toast}) => {
    const {theme} = useThemeStore()
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

     <div className={`p-2 bg-transparent ${color === "green" ?
      "text-green-500 border-green-500/50" : "text-red-500 border-red-500/50"}
      
      w-[30px] h-[30px] flex items-center justify-center
     rounded-full border `}>{color === "green" ? <Check/> : <X/>}</div> 
     
      <p className={`${color === "green" ? "text-green-500" : "text-red-500"} flex items-center text-xs font-semibold`}>{msg}</p>
   </div>
   </div>
 </motion.div>
   )
 }
 
 export default ToasterCompo
 