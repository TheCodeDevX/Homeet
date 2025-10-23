import { Image, Mic, Pause, Play, Send, SendHorizonal, Trash, X } from "lucide-react"
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { useMessageStore } from "../../store/messageStore"
import useRecoder from "../../hooks/useRecoder"
import { FaStop } from "react-icons/fa"
import {motion} from 'framer-motion'
import { useAuthStore } from "../../store/auhStore"
import { useTranslation } from "react-i18next"



  
  const ChatInput = () => {
    const {t} = useTranslation()
    const {selectedUser, sendMessages, uploadAudio} = useMessageStore()
    const {user} = useAuthStore()

    const {startRecording, formatRecorderDate, recordUrl,
       isRecording, stopRecording,  isPlaying, setIsPlaying, mediaStream, mediaRecorder, blb, chunks, showAudio,
        setShowAudio, milisec, setMiliSec} = useRecoder()


    
      
       const [dur , setDur] = useState(0)
       const [isRunning, setIsRunning] = useState(false)
       const audioRef = useRef<HTMLAudioElement>(null)

      


       const handleToggle = () => {
       
        if(!recordUrl)  return;
        const audio = audioRef.current
       if(isPlaying) {
        audio?.pause()
        setIsPlaying(false)
       } else {
        audio?.play()
        setIsPlaying(true)
       }
          
       }



    useEffect(() => {
  
      const audio = audioRef.current
      if(!audio) return;
       const handleDurationChange = () => {
     
         const duration = audio.duration === Infinity || !audio.duration ? (milisec / 1000) : audio.duration
        const result = (audio.currentTime / duration) * 100
        setDur(result)
       }

       const onEnded = () => {
        audio.pause()
        setIsPlaying(false)
       }

       const onPlay = () => {
        setIsPlaying(true);
        audio.play()
       }

       const onPause = () => {
        setIsPlaying(false);
        audio.pause()
       }
       audio?.addEventListener("timeupdate", handleDurationChange);
       audio.addEventListener("ended", onEnded)
       audio.addEventListener("play", onPlay)
       audio.addEventListener("pause", onPause)
       return () => {
        audio?.removeEventListener("timeupdate", handleDurationChange)
           audio.removeEventListener("ended", onEnded)
        audio.removeEventListener("play", onPlay)
       audio.removeEventListener("pause", onPause)
       }
    
    }, [recordUrl, isPlaying])

    
    
    const inputRef = useRef<HTMLInputElement>(null)

    const [image, setImage] = useState("");
    const [imgPreview, setImagePreview] = useState("")
    const [text, setText] = useState("")
 


    const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if(selectedUser?._id && (text.trim() !== "" || image.trim() !== "")) {
       await sendMessages(selectedUser?._id,  {text, image})
    }
    setText("");
    setImage("");
    setImagePreview("");
    } catch (error) {
      console.error("an error occured!")
    }
    }

    const handleUploadImage = (e:ChangeEvent<HTMLInputElement>) => {
     e.preventDefault();
     const files = e.target.files;
     if(!files) return;
     const file = files[0];
     if(!file.type.startsWith("image")) console.error("please select an image")
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async() => {
      const imagebase64 = reader.result as string;
      setImage(imagebase64)
      setImagePreview(imagebase64)
      }
     
    }
    if(!selectedUser || !user) return;


    const handleProgressChange = (e:React.MouseEvent) => {
      const aud = audioRef.current
      if(!aud || !dur) return;
      const rect = e.currentTarget.getBoundingClientRect();
      // get the relative click based on the parent not the browser.
      const relativex = e.clientX - rect.left ;
      if(rect.width <= 0) return;
      const percent = relativex / rect.width;
      aud!.currentTime = percent * aud?.duration;
    }

    return (
      
     <div className="px-4 py-2">
     {recordUrl &&   <audio className="hidden" ref={audioRef} src={recordUrl.toString()}></audio>}
    {imgPreview && (
       <div className="relative w-fit">
       <img className="size-20 rounded mb-1 border border-gray-500" src={imgPreview ?? ""} alt="" />
        <button onClick={() => setImagePreview("")} className="absolute -top-2.5 -right-2.5 ">
         <X className="hover:bg-error hover:text-base-300 transition-colors duration-200 bg-base-300 p-2 rounded-full" size={28}/>
        </button>
     </div>
    )}
       {showAudio ? (<div className="flex items-center justify-end bg-base-300 py-2 px-4 rounded-xl gap-2">
         <button onClick={() => { setShowAudio(false); setIsRunning(false); setIsPlaying(false)
         setDur(0)
         setMiliSec(0)
         audioRef.current = null;
         mediaStream.current?.getTracks().forEach(track => track.stop());
        chunks.current = []
          mediaRecorder.current?.stop();
          mediaRecorder.current = null;
           mediaStream.current = null
         
         }} className="btn btn-circle hover:bg-red-500 bn-xs">
          <Trash size={20}/></button>
             {isRunning ? (<>
             
            <button onClick={() => {stopRecording(); setIsRunning(false); setDur(0); setIsPlaying(false)}} 
            className="btn btn-ghost btn-circle flex items-center justify-center"> 
              <FaStop/>
            </button>
             </>) : (
               <button onClick={handleToggle} className="btn btn-ghost btn-circle flex items-center justify-center"> 
               {isPlaying ? <Pause size={20}/> : <Play size={20}/>}
              </button>
             )}

           <div onClick={handleProgressChange} className="h-2 w-full bg-white rounded-full relative overflow-hidden cursor-pointer">
            <motion.span animate={{width:`${isRunning ? 0 : dur}%`}} className={`bg-green-500 absolute rounded-full h-2`}/>
           </div>
      
       { <span className="text-xl">{formatRecorderDate(milisec)}</span>}
       <button className="btn btn-square bg-green-500 hover:bg-green-600 text-base-300" 
       onClick={() => blb &&
        uploadAudio(blb, selectedUser?._id, user?._id)}  disabled={!recordUrl}><SendHorizonal/></button>
        </div>) : (
        <div className="flex justify-end items-end mt-auto">
      
      <form onSubmit={handleSubmit} className="flex items-center justify-between w-full gap-1">
      
          <input value={text} onChange={(e) => setText(e.target.value)} type="text"
            placeholder={t("placeholders.typeSomething", {ns:"common"})} className="input input-bordered text-sm w-full " />
       <label>
        <input ref={inputRef} onChange={handleUploadImage} type="file" accept="image/*" className="hidden" />
        <button type="button" onClick={() => inputRef.current && inputRef.current.click()}
         className={`btn bg-base-100 border-base-content/5 ${image && imgPreview ? "text-green-500" : "text-base-content"}`}>
          <Image/>
        </button>
       </label>
         <button type="button" onClick={() => {startRecording(); setShowAudio(true); setIsRunning(true)}} className="btn bg-base-100 border-base-content/5 ">
          <Mic/>
        </button>


       <button
         className="btn bg-base-100 border-base-content/5" type="submit"><Send/></button>
      </form>
      </div>
       )}
     </div>
    )
  }
  
  export default ChatInput
  