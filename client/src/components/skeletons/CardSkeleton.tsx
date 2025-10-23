

 import { Heart, Info } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image } from 'lucide-react'
import { useListingStore } from '../../store/listingStore'
 
 const CardSkeleton = () => {
  const {isLoading} = useListingStore()
   return (
    <div className={`sm:p-2.5 p-4 w-full h-full overflow-hidden bg-base-300/50 border border-base-content/10
     shadow-sm rounded-xl ${isLoading ? "cursor-wait" : "cursor-default"} `}>
       <div className='sm:h-[380px] bg-base-300 skeleton max-xs:h-[300px] h-[400px]
                    w-full object-cover max-md:object-fill p-1 relative'
                      >

                    <div className="flex items-center justify-between">
                           
                                 <div className={`bg-base-100 border border-base-content/10
                                    p-2 transition-colors duration-300
                                  rounded-full `}>
                                   <span className='avatar rounded-full p-3 flex skeleton'/>
                                   </div>
                               
                             
                        
                              <div
                               className={`bg-base-100 w-[111.60px] 
                                 border border-base-content/10 gap-2 px-4 py-2 transition-colors duration-300
                                  rounded-full 
                                  flex text-center 
                                  items-center select-none `}>
                                     <span className='avatar rounded-full p-3 skeleton'/>
                                        <span className='skeleton w-full h-3'/>
                              </div>
                    </div>
                      
      </div>
    </div>
   )
 }
 
 export default CardSkeleton
 