

 import { CheckIcon, User, Users } from 'lucide-react'
import avatar from '../assets/avatar.png'
import verificationIcon from '../assets/verificationIcon.svg'
import { useEffect, useRef, useState } from 'react'
import { useFollowRequestStore } from '../store/followReqStore'
import { useListingStore } from '../store/listingStore'
import { useMessageStore } from '../store/messageStore'
import type { UserData } from ".././../../backend/src/shared/types/types"
import { useLocation, useNavigate } from 'react-router-dom'
import NotificationsSkeleton from '../components/skeletons/NotificationsSkeleton'
import  FallbackCard from '../components/FallbackCard'
import i18n from '../config/reacti18next'
import { t } from 'i18next'
import * as helpers from "../utils/helpers"
import { useAuthStore } from '../store/auhStore'
import { useNotificationStore } from '../store/notificationStore'
import { m } from 'framer-motion'
 
 const NotificationPage = () => {
    const {user} = useAuthStore()
    const {listing} = useListingStore()
    const {setSelectedUser} = useMessageStore()
    const {sendFollowReq, setIsAlreadyFollowed, isAlreadyFollowed, followReq} = useFollowRequestStore();
    const {getIncomingNotifs, notifications, currentPage, isLoading, setNotifications, 
    setCurrentPage, markAsRead, notifIds, isNotifLoading, markAsArchived, deleteArchivedNotifs}
    = useNotificationStore()
    const navigate = useNavigate()
    const location = useLocation()
    const observer = useRef<IntersectionObserver | null>(null)
    const [visibleNotifs, setVisibleNotifs] = useState<string[]>([]);
    const idsRef = useRef(new Set())  

  
    // useEffect(() => {
    //   getIncomingRequests()
    //   console.log('followreqs', followReqs)
    // } , [getIncomingRequests])

    useEffect(() => {
    
    const onScroll = () => {
    let lastCall = 0;
    const throttleDelay = 500 // 500ms 
    const now = Date.now();

    if(now - lastCall < throttleDelay) {
    return;
    };
    lastCall = now;

    const visibleArea = window.innerHeight;
    const scrollTop = window.scrollY
    const documentHeight = window.document.documentElement.scrollHeight
    if(visibleArea + scrollTop >= documentHeight && !isLoading && !isNotifLoading ) { 
    setCurrentPage(currentPage + 1)
    getIncomingNotifs();
    }
    }
    window.addEventListener("scroll", onScroll)
    console.log('notifs', notifications)
    return () => window.removeEventListener("scroll", onScroll)
  } , [currentPage])


  useEffect(() => {

    observer.current = new IntersectionObserver((entries) => {
    console.warn(entries, 'entries')
    const visible = entries.filter(e => e.isIntersecting &&
    notifications.find(n => n._id === e.target.id)?.status === "new"
    ).map((e) => e.target.id)
    setVisibleNotifs(visible)

    }, {threshold:1, root:null, rootMargin: "0px"});

    notifications.forEach((notif) => {
    const el = document.getElementById(`${notif._id}`);
    if(el) {
    observer.current?.observe(el);
    console.log("notif element", el) 
    }
    });
    return () => {
     notifications.forEach((notif) => {
      const el = document.getElementById(`${notif._id}`);
      if(el) {
        observer.current?.unobserve(el);
        console.log("notif element", el) 
      }
    })
   }
  }, [currentPage, notifications])
 console.warn(visibleNotifs, 'vis')

  console.log(notifications, 'notifs')


useEffect(() => {
  
   if(visibleNotifs.length > 0){
   markAsRead(visibleNotifs)
  }
 
}, [visibleNotifs])

  useEffect(() => {
  const timer = setTimeout(() => {
  const filteredNotifs = notifications
  .filter(n => n.status === "read" && !idsRef.current.has(n._id)
  );

  const targetNotifIds = filteredNotifs
  .map(n => n._id);
  console.log(targetNotifIds, 'TARGET NOTIFS')
  if(targetNotifIds.length === 0) return;
  targetNotifIds.forEach(id => idsRef.current.add(id));
  markAsArchived(targetNotifIds);
  
  }, 1000)

  return () => clearTimeout(timer);
  }, [notifications])
  


 console.warn(isAlreadyFollowed, 'isAlreadyFollowed')
   return (
     <div className=' h-auto mt-24 p-2 sm:p-4 absolute inset-0 top-0 '>
      <div className="max-w-5xl w-full h-full mx-auto sm:p-4 p-2 ">
         <h1 className="lg:text-4xl md:text-3xl text-2xl font-black mb-2">
                {t("links.NOTIFICATIONS", {ns:"nav"})}
         </h1>
         {notifications.map((n) => n.type === "FOLLOW_REQ").length > 0 &&
          <div className='flex items-center gap-2' >
           <p className='md:text-lg text-sm text-base-content/80 font-semibold flex items-center gap-1 '>
            <Users className='md:size-[20px] size-[18px]'/> {t("labels.newFollowers", {ns:"common"})}
          </p>
          <span className='p-2 md:size-6 size-4 md:text-sm text-xs  flex items-center justify-center
           bg-primary text-primary-content rounded-full'>
            {notifications.map((n) => n.type === "FOLLOW_REQ").length}</span>
         </div>}
       

        
          <div className="flex flex-col gap-2 mt-2">
             { notifications.length === 0 && !isLoading ?
              <div>
                <FallbackCard icon="notifs" header='No Notifications Yet' subtext='please wait until you receive new 
                notifications to be able to see them appear here'/>
              </div>
              
             : 
             
             notifications.map((notif) => (
          <div key={notif._id as string} id={`${notif._id}`}  className="relative">
            {
           
          <div className="card border border-base-content/10 shadow-[0px_0px_30px_1px] shadow-primary/10 bg-base-300
           flex items-center justify-center gap-4 p-8">
            {/* <div className='absolute'> {notif?.status} {notif?.readAt?.toString()}</div> */}
            <section className="flex items-center justify-between w-full gap-2 ">
                <div className="relative">
                  <div className='avatar '>
                  <div className="size-14 rounded-full border border-base-content/10 shadow-sm shadow-base-300/50">
                      <img className='' src={notif?.sender?.profilePic || avatar} alt="" />
                      
                  </div>
              
              </div>
            <p className={`absolute top-1 ${i18n.language === 'ar' ? 'right-1' : 'right-4'}`}>
                <span className='absolute inline-block size-2.5 bg-red-600 rounded-full animate-ping'/>
                 <span className='absolute inline-block size-2.5 bg-red-600 rounded-full'/>
            </p>
                </div>
             <header className="w-full flex flex-col justify-start items-start">
            
             
                <figure className='flex items-center gap-1 '>
                  <h2 className=' xs:text-lg text-md font-bold truncate line-clamp-1'>
                    {notif?.sender?.firstName}
                    </h2>
                   <img className='pointer-events-none select-none' src={verificationIcon} alt="" />
              </figure>

              
              
              <p className='text-sm text-base-content/80'> 
              {t("clientMessages.FOLLOW_MESSAGE", {ns: "messages", context : notif?.sender?.firstName })}
            </p>
          

             </header>
          
       <div className="flex max-sm:flex-wrap items-center justify-end gap-2 w-full">
          { notif?.sender?.role !== "tenant" && 
            <button onClick={() =>
               helpers.handleFollowReq({
               userId:notif.recipient?._id?.toString(),
               recipientId:notif.sender._id,
               notifId: notif._id.toString(),
               sendFollowReq,
               setIsAlreadyFollowed,
            })
          } className={`btn sm:px-10 px-5 max-sm:w-full
             ${notif.sender?.followers?.includes(notif.recipient?._id as string) ?? false
             ? "!bg-accent !text-accent-content hover:!border hover:!border-error-content/50 hover:!bg-error hover:!text-error-content" 
             : " btn-primary"}  border border-base-content/20`}>
              {t(`buttons.${notif.sender?.followers?.includes(notif.recipient?._id as string) ?? false ? "mutualFollow" : "followBack"}`, {ns : "common"})}
            <CheckIcon/>
            </button>}

              <button onClick={() => helpers.handleNavigation({listingUser:notif?.sender ?? undefined,
               navigate,
               setSelectedUser})}
               className='btn sm:px-10 px-5 max-sm:w-full btn-outline border border-base-content/20'>
            {t("buttons.message", {ns:"common"})}
            </button>
       </div>
             
             </section>
         </div>
            }
         
         </div>
          ) ) }
            {isLoading && <NotificationsSkeleton/>}
          </div>
        
      </div>
     </div>
   )
 }
 
 export default NotificationPage
 