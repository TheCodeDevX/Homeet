

 import { ChevronLeft, ChevronRight } from 'lucide-react'
 import {motion} from 'framer-motion'
import useCarouselControls from '../hooks/useCarouselControls'
import { useListingStore } from '../store/listingStore'
import home from "../assets/Tinyhouse.svg"
 
 const Carousel = () => {
    const {state, dispatch} = useCarouselControls()
    const {listing} = useListingStore()
   return (
   
          <div className="overflow-hidden rounded-2xl relative">
             
                   <div className="w-full bg-base-100 h-[500px] flex items-center justify-center">
                    <img key={listing?.images[state.currentIndex]} 
                    className='size-full object-cover object-center transition-opacity opacity-0 duration-500' 
                    onLoad={(e) => e.currentTarget.classList.add("!opacity-100")}
                    src={listing?.images[state.currentIndex] || home} alt="Image" />
               </div>
                 
        { listing?.images && listing?.images?.length > 1  &&  <motion.div>
          <button onClick={(() => dispatch({type: "prev", length:listing?.images?.length ?? 0 }))}
       className={` bg-gradient-to-r from-zinc-500 to-zinc-300/50 
        shadow-[inset_-2px_-2px_10px_rgba(225,225,225,1)] transition-colors duration-300
          cursor-pointer rounded-full absolute z-50 p-2 top-1/2 left-1 
          -translate-y-1/2 text-white flex items-center gap-2 hover:from-zinc-600 hover:fto-zinc-400/50`}>
           <ChevronLeft/>
      </button>

      <button  onClick={(() => dispatch({type: "next",length:listing?.images.length ?? 0}))}
       className={`bg-gradient-to-l from-zinc-500 to-zinc-300/50 shadow-[inset_2px_2px_10px_rgba(225,225,225,1)]  transition-colors duration-300
          cursor-pointer rounded-full absolute z-50 p-2 top-1/2 right-1 
          -translate-y-1/2 text-white flex items-center gap-2 hover:from-zinc-600 hover:to-zinc-400/50`}>
           <ChevronRight/>
      </button>
      <div className='absolute bottom-1 flex items-center justify-center gap-1 w-full select-none pointer-events-none'>
       {listing?.images.map((img, i) => (
         <div key={i}>
         {listing?.images?.length > 12 ? (
          <p className={`text-6xl ${state.currentIndex === i ? "text-white" : "text-white/50"}`}>.</p>
        
         ) : (
             <img className={`size-10 object-center rounded-lg border-2 
          ${state.currentIndex === i ? "border-green-500" : "border-none"} `}
            src={img} alt="Preview" />
         )}
         </div>
       ))}
      </div>
       </motion.div>}
              </div>
              
   )
 }
 
 export default Carousel
 