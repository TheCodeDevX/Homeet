import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import {motion} from 'framer-motion'
import { useLocation } from "react-router-dom";
const ToastMessage = ({msg, msgType}: {msg:string, msgType : "success" | "error" | "" }) => {
  const location = useLocation()
  const [showMsg, setShowMsg] = useState<string | null>(null)


  useEffect(() => {
   if(!msg) return;
   setShowMsg(msg)
    const timer = setTimeout(() => { setShowMsg(null) }, 2000);
     return () => clearTimeout(timer);
  }, [msg])

 return (
  <> {msg 
    && (<><motion.div
      transition={{duration:1, type:"spring", damping:40, stiffness:200}}
     animate={{opacity:showMsg ? 1 : 0, y:showMsg ? 0 : -40}}
     className={`fixed top-5 z-[55]`}>
   <div className={`flex w-screen justify-center ${location.pathname === "/" ? "2xl:w-[calc(100vw-18rem)]" : "w-screen"}`}>
     <div className="bg-base-300 border border-green-500/50 px-9 py-3 rounded-xl 
   shadow-[inset_1px_1px_40px_rgba(0,128,0,0.1),1px_1px_20px_rgba(0,128,0,0.5),1px_1px_10px_rgba(225,225,225,0.25)]
    flex items-center justify-center text-center gap-2">
     <div className="p-2 bg-transparent text-green-500 w-[30px] h-[30px] flex items-center justify-center
     rounded-full border border-green-500/50"><Check/></div> 
      <p className=" text-green-500 flex items-center text-xs font-semibold ">{msg}</p>
   </div>
   </div>
 </motion.div></>)}

    {msg && (<>
    <motion.div initial={{opacity:0, y:-20}}
     transition={{duration:1, type:"spring", damping:40, stiffness:200}}
    animate={{opacity:showMsg ? 1 : 0, y:showMsg ? 0 : -40}}
     className={`fixed top-5 z-[55]`}>
   <div className={`flex w-screen justify-center`}>
     <div className="bg-base-300 border border-red-500/50 px-9 py-3 rounded-xl 
   shadow-[inset_1px_1px_40px_rgba(225,0,0,0.1),1px_1px_20px_rgba(225,0,0,0.5),1px_1px_10px_rgba(225,225,225,0.25)]
    flex items-center justify-center text-center gap-2">
     <div className="p-2 bg-transparent text-red-500 w-[30px] h-[30px] flex items-center justify-center
     rounded-full border border-red-500/50"><X/></div> 
      <p className=" text-red-500 flex items-center text-xs font-semibold ">{msg}</p>
   </div>
   </div>
 </motion.div>
    </>)
     }</>
)
}
export default ToastMessage;


//  import React from 'react'
// import toast from 'react-hot-toast'
 
//  const ToastMessage = ({msg} : {msg:string}) => {
//   if(!msg) return;
//    toast.success(msg)
//  }
 
//  export default ToastMessage
 