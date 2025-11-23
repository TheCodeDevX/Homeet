import { useMessageStore } from "../../store/messageStore"
import avatar from '../../assets/avatar.png'
import { useAuthStore, type UserData } from "../../store/auhStore";
import { Search, Users2 } from "lucide-react";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { useTranslation } from "react-i18next";
import i18n from "../../config/reacti18next";
import { useListingStore } from "../../store/listingStore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFollowRequestStore } from "../../store/followReqStore";
import LoadingSpinner from "../Spinner";
import { useUserStore } from "../../store/userStore";
 
 const ChatSidebar = ({filteredUsers} : {filteredUsers : UserData[]}) => {
  const {setSelectedUser, users, selectedUser, isUsersLoading, setIsUserLoading, getUsers, addOrRemoveUser} = useMessageStore();
  // const {followReqs, followReq} = useFollowRequestStore()
  const {user:authUser, onlineUsers:OnlineUsers} = useAuthStore();
  const {listing} = useListingStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const {followReq} = useFollowRequestStore()
 


  const onlineUsers = users.filter(users => OnlineUsers.includes(users._id as string) )
  const location = useLocation()
  const navigate = useNavigate()
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  // useEffect(() => {
    
  // }, [onlineUsers])


  useLayoutEffect(() => {
  console.log(scrollRef.current?.children.length)
  refs.current[selectedUser?._id as string]?.scrollIntoView({
    behavior: "smooth"
  })
  }, [users.length])


  useEffect(() => {
    console.warn("run again")
   const debounce = setTimeout(() => {
      getUsers(false);
   }, 400)

   return ( ) => clearTimeout(debounce);
  }, [getUsers, OnlineUsers])

  useEffect(() => {
    getUsers(true)
  }, [])

 

  
 

  

  // translation 
  const {t} = useTranslation()
  const lang = i18n.language



   return (

     <div className={`w-48 max-md:w-full max-md:mt-[108px] ${selectedUser ? "max-md:-z-10" : "max-md:z-10"}
          absolute inset-0 max-md:h-[calc(100%-108px)]
        ${lang === "ar" ? "border-l border-l-base-content/20" :  "border-r border-r-base-content/20"} overflow-hidden
     `}>
      
     
         <div ref={scrollRef} id="parent" className="flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden max-h-full">
          {filteredUsers.length === 0 && !isUsersLoading ? (
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full">
           <div className="flex flex-col items-center justify-center w-full text-center">
              <Users2/>
            <p className="text-sm">{t("chatMessages.noUserFoundMessage", {ns:"messages"})} </p>
          
          </div>
            </div>
          )
           : isUsersLoading ? (<SidebarSkeleton/>) : filteredUsers.map((user) => (
         
           <button id="child" data-id={user._id} 
            ref={el => {refs.current[user._id as string] = el} } key={user._id} onClick={() => {
             setSelectedUser(user)}}
             
             className={`hover:bg-primary/10 p-4 h-[calc(485px/5)] max-md:h-[97px] flex flex-col
               ${ selectedUser?._id?.toString()  === user?._id?.toString() ? "bg-primary/10" : "bg-base-100"} `}>
              <div className="flex items-center gap-2">
                <div className="relative">
                   <div className='avatar '>
                  <div className="size-14 relative rounded-full border border-base-content/10 shadow-sm
                   shadow-base-300/50">
                      <img src={user?.profilePic || avatar} alt="profile"
                      onError={(e) => e.currentTarget.src = avatar}
                      />
                      
                  </div>
              </div>
                <div className="flex">
                  {  onlineUsers.includes(user) ? (
                  <div>
                 <span className='absolute inline-block bottom-2 right-1 size-2.5 bg-green-500 rounded-full animate-ping'/>
                 <span className='absolute inline-block bottom-2 right-1 size-2.5 bg-green-500 rounded-full'/>
                  </div>
                  ) : (
                    
                 <span className='absolute inline-block bottom-2 right-1  size-2.5 bg-gray-500 rounded-full'/>
                 
                  ) }
                </div>
                </div>
                {/* <div className="avatar size-12 relative">
                <img src={user.profilePic || avatar} alt="Profile Picture" className="rounded-full" />
                <div className="flex">
                  {  onlineUsers.includes(user) ? (
                  <div>
                 <span className='absolute inline-block bottom-0 right-0 size-2.5 bg-green-500 rounded-full animate-ping'/>
                 <span className='absolute inline-block bottom-0 right-0 size-2.5 bg-green-500 rounded-full'/>
                  </div>
                  ) : (
                    
                 <span className='absolute inline-block bottom-0 right-0 size-2.5 bg-gray-500 rounded-full'/>
                 
                  ) }
                </div>
              </div> */}
            <div className={`flex flex-col ${lang === "ar" ? "text-right" : "text-left"}`}>
                <h1 className="text-md font-semibold">{user.firstName}</h1>
                <span className={`text-xs ${onlineUsers.includes(user) ? " text-green-500" : " text-gray-500"} -mt-1`}>
                  {`${ onlineUsers.includes(user) 
                  ? t("status.online", {ns:"status"})
                  : t("status.offline", {ns:"status"})}`}</span>
            </div>
              </div>
            </button> 
          
          ))}
         </div>
      
     </div>
   )
 }
 
 export default ChatSidebar
 