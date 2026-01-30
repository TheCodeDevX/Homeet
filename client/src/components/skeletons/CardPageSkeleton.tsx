

 import { Loader } from 'lucide-react'
import React from 'react'
 
 const CardPageSkeleton = () => {
  document.body.style.overflow = "hidden";
   return (
      <div className="relative mt-24">
   
     {/* <div className="fixed left-4 top-28 z-10 w-[25%] h-[280px]
      flex flex-col gap-2 items-center justify-center bg-base-300 rounded py-8 px-4">

         <span className=' bg-base-100/50 w-[55%] h-12 py-1 mb-2 skeleton'/>

         <span className=' bg-base-100/50 w-[18%] self-start flex h-8 py-1 skeleton'/>
         <span className=' bg-base-100/50 w-full mb-2 h-12 py-4 skeleton'/>

         <span className=' bg-base-100/50 w-[20%] self-start flex h-8 py-1 skeleton'/>
         <span className=' bg-base-100/50 w-full mb-2 h-12 py-4 skeleton'/>

         <span className=' bg-base-100/50 w-full h-12 ring-base-content/10 px-4 py-6 skeleton'/>
      </div> */}

      <div className="max-w-2xl w-full mx-auto space-y-0 lg:p-4 p-2">
        <div className="bg-base-300 min-h-screen border border-base-content/20 rounded-xl p-6 shadow-2xl space-y-4">
        <div className='flex flex-col'>
            <div className=' bg-base-100/50 w-[20%] self-start flex h-4 mb-4 skeleton'/>

            {/* profile picture section */}
           <div className='flex justify-between'>
              <div className='flex items-center gap-2'>
                  <span className='size-20 object-cover skeleton avatar bg-base-100/50 rounded-full'/>
                    <div className="flex flex-col gap-2">
                      <span className='bg-base-100/50 w-[100px] h-4 skeleton'/>
                      <span className='bg-base-100/50 w-[60px] h-2 skeleton'/>
                    </div>
                </div>

               <div className="flex items-center gap-4 max-sm:hidden ">
                 <div className='w-[123px] h-12 skeleton bg-base-100/50'/>
                <div className='w-[123px] h-12 skeleton bg-base-100/50'/>
               </div>
           </div>
            <span className='mt-4 bg-base-100/50 w-[80px] h-3 skeleton'/>
            <span className='mt-4 bg-base-100/50 w-28 h-6 skeleton'/>

            <div className='mt-4 h-[500px] w-full bg-base-100/50'/>
          </div>
        </div>

      </div>
      </div>


   )
 }
 
 export default CardPageSkeleton
 