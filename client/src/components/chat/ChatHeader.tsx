
import { useMessageStore } from "../../store/messageStore"
import avatar from '../../assets/avatar.png'
import { X } from "lucide-react"
import { useTranslation } from "react-i18next"



  const ChatHeader = () => {
    const {selectedUser, setSelectedUser} = useMessageStore()
    const {t} = useTranslation()
    return (
      <div className="flex w-full items-center justify-between p-2 bg-base-300/50 border-b border-b-base-content/20">
      <div className="flex items-center justify-center gap-2">
          <div className="rounded-full overflow-hidden size-10">
          <img src={selectedUser?.profilePic || avatar} alt="" />
        </div>
         <div className="flex flex-col items-start text-left">
           <h1 className="font-semibold"> {`${selectedUser?.firstName} ${selectedUser?.lastName}`}</h1>
        <span className="text-xs -mt-0.5 text-base-content/70">
       {t("chatMessages.headerMsg", {name:selectedUser?.firstName, ns : "messages"})}</span>
         </div>
      </div>
          <button onClick={() => setSelectedUser(null)} className='btn btn-sm hover:btn-error rounded-full size-11'>
                <X/>
              </button>
      </div>
    )
  }
  
  export default ChatHeader
  