

 import { Users } from 'lucide-react'
import avatar from '../assets/avatar.png'
import verificationIcon from '../assets/verificationIcon.svg'
import { useEffect, useState } from 'react'
import { useFollowRequestStore } from '../store/followReq'
import { useListingStore } from '../store/listingStore'
import { useMessageStore } from '../store/messageStore'
import type { UserData } from '../store/auhStore'
import { useNavigate } from 'react-router-dom'
import NotificationsSkeleton from '../components/skeletons/NotificationsSkeleton'
import  FallbackCard from '../components/FallbackCard'
 
 const NotificationPage = () => {
  const {getIncomingRequests, followReq, followReqs, isReqLoading} = useFollowRequestStore()
  const {listing} = useListingStore()
  const {setSelectedUser} = useMessageStore()
  

  const navigate = useNavigate()
  useEffect(() => {
    getIncomingRequests()

  } , [getIncomingRequests])


  const handleNavigation = (sender : UserData) => {
      if(!sender) return; 
      setSelectedUser(sender)
      navigate("/chat");
    }
  


 
   return (
     <div className=' h-auto mt-24 p-2 sm:p-4 absolute inset-0 top-0 '>
      <div className="max-w-5xl w-full h-full mx-auto sm:p-4 p-2 ">
         <h1 className="lg:text-4xl md:text-3xl text-2xl font-black mb-2">
                Notifications
          </h1>
         <div className='flex items-center gap-2 mb-4'>
           <p className='md:text-lg text-sm text-base-content/80 font-semibold flex items-center gap-1 '>
            <Users className='md:size-[20px] size-[18px]'/> New Followers
          </p>
          <span className='p-2 md:size-6 size-4 md:text-sm text-xs  flex items-center justify-center
           bg-primary text-primary-content rounded-full'>
            {followReqs.length}</span>
         </div>

        
          <div className="flex flex-col gap-2">
             { followReqs.length === 0 ?
              <div>
                <FallbackCard icon="notifs" header='No Notifications Yet' subtext='please wait until you receive new 
                notifications to be able to see them appear here'/>
              </div>
              : isReqLoading ? <NotificationsSkeleton/>
             : followReqs.map((followRequest) => (
          <div key={followRequest.sender?._id} className="relative">
          <div className="card border border-base-content/10 shadow-[0px_0px_30px_1px] shadow-primary/10 bg-base-300
           flex items-center justify-center gap-4 p-8">
            <section className="flex items-center justify-between w-full gap-2 ">
                <div className="relative">
                  <div className='avatar '>
                  <div className="size-14 rounded-full border border-base-content/10 shadow-sm shadow-base-300/50">
                      <img className='' src={followRequest?.sender?.profilePic || avatar} alt="" />
                      
                  </div>
              
              </div>
            <p className='absolute top-1 right-4'>
                <span className='absolute inline-block size-2.5 bg-red-600 rounded-full animate-ping'/>
                 <span className='absolute inline-block size-2.5 bg-red-600 rounded-full'/>
            </p>
                </div>
             <header className="w-full flex flex-col justify-start items-start">
            
             
                <figure className='flex items-center gap-1 '>
                  <h2 className=' xs:text-lg text-md font-bold truncate line-clamp-1'>
                    {followRequest?.sender?.firstName}
                    </h2>
                   <img className='pointer-events-none select-none' src={verificationIcon} alt="" />
              </figure>

              
              
              <p className='text-sm text-base-content/80'>{followRequest?.sender?.firstName} started following you
            </p>
          

             </header>
             
          
       <div className="flex max-sm:flex-wrap items-center justify-end gap-2 w-full">
        
          { followRequest?.sender?.role !== "tenant" && 
         <button className='btn sm:px-10 px-5 max-sm:w-full btn-primary  border border-base-content/20'>
              Follow Back
            </button>}

              <button onClick={() => handleNavigation(followRequest?.sender as UserData)}
               className='btn sm:px-10 px-5 max-sm:w-full btn-outline border border-base-content/20'>
             Message
            </button>
       </div>
             
             </section>
         </div>
         </div>
          ) ) }
          </div>
        
      </div>
     </div>
   )
 }
 
 export default NotificationPage
 