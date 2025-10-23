import { useEffect, useState, useRef } from "react"
import { useAuthStore } from "../../store/auhStore"
import { useMessageStore } from "../../store/messageStore"
import { Loader, MessageSquarePlus, Pause, Play } from "lucide-react"
import avatar from '../../assets/avatar.png'
import {motion} from 'framer-motion'
import ChatSkeleton from "../skeletons/ChatSkeleton"
import { useTranslation } from "react-i18next"
import i18n from "../../config/reacti18next"
import { formatDate } from "../../utils/formatDate"


 
 const ChatContainer = () => {
  const {user} = useAuthStore()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const {selectedUser, getMessages, messages, subToMessages, unsubFromMessages, isMessagesLoading} = useMessageStore()
  const audioRef = useRef<{[id:string] : HTMLAudioElement | null}>({})
  const [msgId, setMsgtId] = useState("") 
  const [isPlaying, setIsPlaying] = useState<null | string>(null)
  const [currTime, setCurTime] = useState<{[id:string] : number}>({})
  




  const handlePausing = (id:string) => {
        const audio = audioRef.current[id] 
        if(!audio) return;
        setIsPlaying(null)
        audio.pause()
       }

       const handlePlaying = (id:string) => {
        setMsgtId(id)
        const audio = audioRef.current[id] 
        if(!audio) return;
        audio.play()
     
          setIsPlaying(id)  
         
       }

      


   useEffect(() => {
     
      getMessages(selectedUser?._id?.toString() as string)
      subToMessages()
      return () => unsubFromMessages()
   }, [selectedUser])


   useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior:"smooth"})
   }, [messages])


   useEffect(() => {
      const audio = audioRef.current[msgId]
      if(!audio) return;

    
      
       const handleDurationChange = () => {
        if(!audio.duration) return;
        setCurTime((prev) => ({...prev, [msgId] : audio.currentTime  }))
        
       }

       const handlePlay = () => {
        if(!msgId) return;
        let audio = audioRef.current[msgId];
        if(!audio) return;
        audio.play()
        setIsPlaying(msgId)
        handleDurationChange()
        
      
       }


       const handlePause = () => {
       setIsPlaying(null)
       audio.pause()
       }

       const handleEnd = () => {

        setCurTime((prev) => ({...prev, [msgId] : 100}))
       }

      
      audio.addEventListener("play", handlePlay )

       audio.addEventListener("pause", handlePause )

       audio.addEventListener("ended", handleEnd  )

       audio?.addEventListener("timeupdate", handleDurationChange);
       

       return () => {
         audio?.removeEventListener("timeupdate", handleDurationChange)
        audio.removeEventListener("play", handlePlay )
         audio.removeEventListener("pause", handlePause )
          audio.removeEventListener("ended", handleEnd)
        
       }

       
    
    }, [msgId, audioRef, isPlaying])




   
   const handleProgressChange = (e:React.MouseEvent, messageId:string) => {
    const audio = audioRef.current[messageId]
    if(!audio) return;
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    if(rect.width <= 0) return; 
    const percent = relativeX / rect.width
      audio.currentTime = percent *  audio.duration
   }


   const {t} = useTranslation()
   const lang = i18n.language
   return (
     <div className={`overflow-y-auto ${selectedUser ? "h-[43.8vh]" : "h-[60vh]"} relative`}>
       {isMessagesLoading ? 
       (<ChatSkeleton/>) :
        ( <div className="p-4">
       {selectedUser ? (
        messages.map((message) => (
        
          <div key={message._id} ref={scrollRef}
         className={`chat ${selectedUser._id === message.senderId ? "chat-start" : "chat-end" } `}>
         
           <div className={`flex ${selectedUser._id === message.senderId
             ? "flex-row" : "flex-row-reverse"} items-center gap-2`}>
           <img src={selectedUser._id === message.senderId  ? selectedUser?.profilePic || avatar : user?.profilePic || avatar}
            alt="" className="rounded-full size-12" />
           
         <div className={`chat-bubble ${selectedUser._id === message.senderId ? "bg-neutral" : "bg-base-content text-base-300 "} `}>
          
           {message.image && ( 
            <img className="rounded-xl h-32 w-fit object-contain" src={message.image.toString()} alt={"Image"} />
          )}
         { message.audio && message.audioDuration && (
          <div className="flex items-center justify-center gap-2 w-full ">
       
            {<audio
             ref={el => { audioRef.current[message?._id as string] = el}} controls
             src={message.audio}
             className={`appearance-none hidden`} />}
             <div className="flex items-center">
             
              {
              isPlaying === message._id && audioRef.current[message._id] ? (
                  <button onClick={() => handlePausing(message._id as string)} 
                  className="btn btn-ghost btn-circle flex items-center justify-center"> 
                <Pause size={20}/>
              </button>
              ) : (
                 <button onClick={() => handlePlaying(message._id as string)} className="btn btn-ghost btn-circle flex items-center justify-center"> 
               { <Play size={20}/>}
              </button>
              )}
             
           
              <div className="relative">
                <div onClick={(e) => handleProgressChange(e, message._id as string)}
                className="w-40 bg-base-100 h-2 rounded-full relative overflow-hidden cursor-pointer">
               {  message._id && (<motion.span
                 animate={{width:`${
                  (currTime[message._id] /  message.audioDuration) * 100 }%`}} 
                  className="absolute bg-secondary h-2"/>) }
              
              </div>
               <span className="text-xs absolute mt-1 opacity-60">{isNaN(currTime[message._id as string])
                || currTime[message._id as string] === 0 || currTime[message._id as string] === 100
                ? message.audioDuration.toFixed(2) : currTime[message._id as string].toFixed(2)} s</span>
              </div>
            
             </div>
            
                  <span className="text-xs text-center opacity-70">{formatDate(message.createdAt as string)}</span>
               
          </div>
         ) }
         

          

          {message.text && (
           <div>
            <p className={` ${message.image ? "mt-2" : "mt-0"}`}>{message.text}
                <span className="text-xs text-center opacity-70 ml-2">{formatDate(message?.createdAt as string)}</span>
           </p>
          
           </div>
          )}
         </div>  
        </div> 
       </div>

       
         
        ))
        
       ) : (
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -traslate-y-1/2 max-md:hidden`}>
          <div className="flex items-center justify-center">
              <MessageSquarePlus className="animate-bounce stroke-1 fill-base-300" size={50}/>
          </div>
            <h1 className="text-center text-lg max-sm:text-xs">
              {t("chatMessages.selectingSomeoneMessage", {ns:"messages"})}
            </h1>
          </div>
       )}
     </div>)}
     </div>
   )
 }
 
 export default ChatContainer
 