
 import {motion} from 'framer-motion'
import ChatSidebar from '../components/chat/ChatSidebar'
import ChatInput from '../components/chat/ChatInput'
import ChatContainer from '../components/chat/ChatContainer'
import { useEffect, useState } from 'react'
import { useMessageStore } from '../store/messageStore'
import { Search } from 'lucide-react'
import ChatHeader from '../components/chat/ChatHeader'
import type { UserData } from '../../../backend/src/shared/types/types'
import { useTranslation } from 'react-i18next'
import i18n from '../config/reacti18next'
 
 const ChatPage = () => {
   const {users, getUsers, selectedUser} = useMessageStore();
   const [query, setQuery] = useState("")
   const [isOnBoarded, setIsOnBoarded] = useState(true)
 
 

  const filteredSidebarUsers : UserData[] =
   users.filter(user => {
    return user.firstName.toLowerCase().includes(query.toLowerCase())
 })


 
 
   const {t} = useTranslation()
   const lang = i18n.language
   return (
     <motion.div
      initial={{opacity:0, y:20}}
      animate={{y:0, opacity:1}}
      transition={{duration:0.5}}

      className="relative overflow-hidden p-2 sm:p-4 sm:mt-24 mt-12"
    >
         <div className="relative max-w-5xl w-full max-xs:max-w-sm max-sm:max-w-md
          mx-auto bg-base-200 border border-base-content/20 rounded-xl overflow-hidden shadow-lg ">

    <div className={` flex p-4 md:hidden flex-col ${selectedUser ? "hidden" : "max-md:flex"}`}>
        <h1 className="text-xl mb-1 font-semibold">
            {t("chat.title", {ns : "headers"})}
        </h1>
     <div className="relative">
        <input value={query} onChange={(e) => setQuery(e.target.value)} type="text"
         className="w-full bg-base-300 border border-base-content/20 py-2 px-10 placeholder:text-base-content
        outline-0 " placeholder={t("placeholders.searchUser", {ns: "common"})} />
        <Search className="absolute top-1/2 -translate-y-1/2 left-2 size-5"/>
       
     </div>
       </div>

           <div className="w-40 max-md:w-full">
            <ChatSidebar  filteredUsers={filteredSidebarUsers}/>
           </div>
           <div className={`${lang === "ar" ? "mr-48 max-md:mr-0" : "ml-48 max-md:ml-0 "}`}>
             {selectedUser && <ChatHeader/>}
            <ChatContainer/>
             <ChatInput/>
           </div>
       </div>
     </motion.div>
   )
 }
 
 export default ChatPage
 