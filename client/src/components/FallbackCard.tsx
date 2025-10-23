
 import { BadgeInfo, Bell, Search } from 'lucide-react'
import type { HTMLAttributes } from 'react'

 interface Fallback extends HTMLAttributes<HTMLDivElement>  {header:string , subtext:string,
   icon?:"search" | "info" | "notifs"}
 
 const FallbackCard = ({header, subtext, icon, ...props} : Fallback) => {
   return (
      
         <div className="relative max-5xl mx-auto" {...props}>
          <div className="card border border-base-content/15 shadow-xl bg-base-300 flex items-center
           justify-center gap-4 p-8">
          <div className="p-4 bg-base-200 rounded-full border border-base-content/10 animate-bounce">
           {icon === "search" ? <Search size={30}/>
          : icon ===  "notifs" ? <Bell/>
           :  <BadgeInfo size={30}/>}
          </div>
           <div className="text-center">
            <h1 className='font-semibold lg:text-xl text-lg mb-1.5'>{header}</h1>
            <p className='text-base-content/80 max-lg:text-sm'>{subtext}</p>
           </div>
         </div>
         </div>
    
   )
 }
 
 export default FallbackCard
 