import { useMessageStore } from "../../store/messageStore"
import avatar from '../../assets/avatar.png'
import { useAuthStore } from "../../store/authStore";
import { Users2 } from "lucide-react";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { useTranslation } from "react-i18next";
import i18n from "../../config/reacti18next";
import { useEffect, useLayoutEffect, useRef} from "react";
import type { UserData } from "../../types/types";
import { handleNavigation } from "../../utils/helpers";
 
 const ChatSidebar = ({filteredUsers} : {filteredUsers : UserData[]}) => {
  const {setSelectedUser, users, selectedUser, isUsersLoading, getUsers} = useMessageStore();
  const { onlineUsers:OnlineUsers} = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null)

 


  const onlineUsers = users.filter(users => OnlineUsers.includes(users._id as string) )
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})



  useLayoutEffect(() => {
  console.log(scrollRef.current?.children.length)
  refs.current[selectedUser?._id as string]?.scrollIntoView({
    behavior: "smooth"
  })
  }, [users.length, handleNavigation])


  useEffect(() => {
    console.warn("run again")
   const debounce = setTimeout(() => {
      getUsers({shouldLoad :false});
   }, 400)

   return ( ) => clearTimeout(debounce);
  }, [getUsers, OnlineUsers])

  useEffect(() => {
    getUsers({shouldLoad : true})
  }, [getUsers])

 

  
 

  

  // translation 
  const {t} = useTranslation()
  const lang = i18n.language



   return (

     <div
  className={`
    flex flex-col w-full max-md:w-full flex-shrink-0
    ${lang === "ar" ? "border-l border-base-content/10" : "border-r border-base-content/10"}
    ${selectedUser ? "hidden md:flex" : "flex"}
    h-full overflow-hidden
  `}
>
  <div
    ref={scrollRef}
    className="flex-1 flex flex-col gap-px overflow-y-auto overflow-x-hidden"
  >
    {isUsersLoading ? (
      <SidebarSkeleton />
    ) : filteredUsers.length === 0 ? (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12 text-base-content/30">
        <Users2 className="size-8" />
        <p className="text-sm text-center px-4">
          {t("chatMessages.noUserFoundMessage", { ns: "messages" })}
        </p>
      </div>
    ) : (
      filteredUsers.map((user) => {
        const isOnline = onlineUsers.includes(user);
        const isSelected = selectedUser?._id?.toString() === user?._id?.toString();

        return (
          <button
            key={user._id as string}
            id="child"
            data-id={user._id}
            ref={(el) => { refs.current[user._id as string] = el; }}
            onClick={() => setSelectedUser(user)}
            className={`
              group flex items-center gap-3 px-3 py-3 w-full text-left
              transition-colors duration-150
              ${isSelected
                ? "bg-primary/10 border-r-2 border-primary"
                : "hover:bg-base-300/50"
              }
            `}
          >
            {/* Avatar + online dot */}
            <div className="relative flex-shrink-0">
              <div className="size-11 rounded-full overflow-hidden border border-base-content/10 shadow-sm">
                <img
                  src={user?.profilePic || avatar}
                  alt={user.firstName}
                  onError={(e) => (e.currentTarget.src = avatar)}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online indicator */}
              <span
                className={`
                  absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-base-200
                  ${isOnline ? "bg-green-500" : "bg-base-content/20"}
                `}
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
              )}
            </div>

            {/* Name + status */}
            <div className={`flex flex-col min-w-0 ${lang === "ar" ? "text-right" : "text-left"}`}>
              <span className="text-sm font-semibold truncate leading-tight">
                {user.firstName}
              </span>
              <span className={`text-xs mt-0.5 ${isOnline ? "text-green-500" : "text-base-content/40"}`}>
                {isOnline
                  ? t("status.online", { ns: "status" })
                  : t("status.offline", { ns: "status" })}
              </span>
            </div>
          </button>
        );
      })
    )}
  </div>
</div>
   )
 }
 
 export default ChatSidebar
 