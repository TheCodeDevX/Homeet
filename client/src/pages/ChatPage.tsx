
 import {motion} from 'framer-motion'
import ChatSidebar from '../components/chat/ChatSidebar'
import ChatInput from '../components/chat/ChatInput'
import ChatContainer from '../components/chat/ChatContainer'
import { useState } from 'react'
import { useMessageStore } from '../store/messageStore'
import { MessageSquare, Search } from 'lucide-react'
import ChatHeader from '../components/chat/ChatHeader'
import { useTranslation } from 'react-i18next'
import type { UserData } from '../types/types'
 
 const ChatPage = () => {
   const {users, selectedUser} = useMessageStore();
   const [query, setQuery] = useState("")
 
 

  const filteredSidebarUsers : UserData[] =
   users.filter(user => {
    return user.firstName.toLowerCase().includes(query.toLowerCase())
 })


 
 
   const {t} = useTranslation()
   return (

    
 <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="relative overflow-hidden px-2 sm:px-4 mt-24"
>
  <div className=" relative max-w-5xl w-full mx-auto bg-base-200 border border-base-content/20 rounded-xl overflow-hidden shadow-lg">
    <div className="flex h-[calc(100vh-8rem)] sm:h-[600px]">

      {/* Sidebar — full width on mobile when no user selected */}
      <div
        className={`
          flex-shrink-0 flex flex-col border-r border-base-content/10
          w-full md:w-64
          ${selectedUser ? "hidden md:flex" : "flex"}
        `}
      >
        {/* Sidebar Header + Search */}
        <div className="p-4 border-b border-base-content/10">
          <h1 className="text-xl font-semibold mb-3">
            {t("chat.title", { ns: "headers" })}
          </h1>
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 size-4 text-base-content/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              className="w-full bg-base-300 border border-base-content/20 rounded-lg py-2 pl-9 pr-3 text-sm placeholder:text-base-content/40 outline-none focus:border-primary transition-colors"
              placeholder={t("placeholders.searchUser", { ns: "common" })}
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          <ChatSidebar filteredUsers={filteredSidebarUsers} />
        </div>
      </div>

      {/* Chat Area — full width on mobile when user selected */}
      <div
        className={`
          flex-1 flex flex-col min-w-0
          ${selectedUser ? "flex" : "hidden md:flex"}
        `}
      >
        {selectedUser ? (
          <>
            <ChatHeader />
            <div className="flex-1 overflow-y-auto">
              <ChatContainer />
            </div>
            <ChatInput />
          </>
        ) : (
          /* Empty state on desktop when no user selected */
          <div className="flex-1 flex flex-col items-center justify-center text-base-content/30 gap-2">
            <MessageSquare className="size-10" />
            <p className="text-sm"> {t("labels.selectConvo", {ns : "common"})}</p>
          </div>
        )}
      </div>

    </div>
  </div>
</motion.div>
   
   )
 }
 
 export default ChatPage
 