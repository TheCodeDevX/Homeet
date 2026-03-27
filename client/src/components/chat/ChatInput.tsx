import { Image, Mic, Pause, Play, Send, SendHorizonal, Trash, X } from "lucide-react"
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react"
import { useMessageStore } from "../../store/messageStore"
import useRecoder from "../../hooks/useRecoder"
import { FaStop } from "react-icons/fa"
import {motion} from 'framer-motion'
import { useAuthStore } from "../../store/authStore"
import { useTranslation } from "react-i18next"



  
  const ChatInput = () => {
    const {t} = useTranslation()
    const {selectedUser, sendMessages, uploadAudio} = useMessageStore()
    const {user} = useAuthStore()

    const {startRecording, formatRecorderDate, recordUrl,
        stopRecording,  isPlaying, setIsPlaying, mediaStream, mediaRecorder, blb, chunks, showAudio,
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
  
      const audio = audioRef.current;
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
    
    }, [recordUrl, isPlaying, milisec, setIsPlaying])

    
    
    const inputRef = useRef<HTMLInputElement>(null)

    const [image, setImage] = useState("");
    const [imgPreview, setImagePreview] = useState("")
    const [text, setText] = useState("")
 


    const handleSubmit = async(e:FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
   
      if(selectedUser?._id && (text.trim() !== "" || image.trim() !== "")) {
       await sendMessages(selectedUser?._id.toString(),  {text, image})
    }
    setText("");
    setImage("");
    setImagePreview("");
    
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
      const relativex = e.clientX - rect.left;
      if(rect.width <= 0) return;
      const percent = relativex / rect.width;
      aud!.currentTime = percent * aud?.duration;
    }

    useEffect(() => {
    setImage("")
    setImagePreview("")
    }, [selectedUser])

    return (
      
    <div className="px-4 py-3 border-t border-base-content/10 bg-base-200">

  {/* Hidden audio element */}
  {recordUrl && (
    <audio className="hidden" ref={audioRef} src={recordUrl.toString()} />
  )}

  {/* Image preview */}
  {imgPreview && (
    <div className="relative w-fit mb-3">
      <img
        className="size-20 rounded-lg border border-base-content/20 object-cover"
        src={imgPreview}
        alt="preview"
      />
      <button
        onClick={() => setImagePreview("")}
        className="absolute -top-2 -right-2 size-5 rounded-full bg-error text-error-content
          flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        <X size={12} />
      </button>
    </div>
  )}

  {/* Audio recorder bar */}
  {showAudio ? (
    <div className="flex items-center gap-2 bg-base-300 rounded-xl px-3 py-2">

      {/* Discard */}
      <button
        onClick={() => {
          setShowAudio(false); setIsRunning(false); setIsPlaying(false);
          setDur(0); setMiliSec(0);
          audioRef.current = null;
          mediaStream.current?.getTracks().forEach(t => t.stop());
          chunks.current = [];
          mediaRecorder.current?.stop();
          mediaRecorder.current = null;
          mediaStream.current = null;
        }}
        className="btn btn-circle btn-sm btn-ghost text-error hover:bg-error/10 flex-shrink-0"
      >
        <Trash size={16} />
      </button>

      {/* Stop / Play-Pause */}
      {isRunning ? (
        <button
          onClick={() => { stopRecording(); setIsRunning(false); setDur(0); setIsPlaying(false); }}
          className="btn btn-circle btn-sm btn-ghost flex-shrink-0"
        >
          <FaStop size={12} />
        </button>
      ) : (
        <button
          onClick={handleToggle}
          className="btn btn-circle btn-sm btn-ghost flex-shrink-0"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      )}

      {/* Progress bar */}
      <div
        onClick={handleProgressChange}
        className="flex-1 h-1.5 bg-base-content/15 rounded-full relative overflow-hidden cursor-pointer"
      >
        <motion.span
          animate={{ width: `${isRunning ? 0 : dur}%` }}
          className="absolute inset-y-0 left-0 bg-green-500 rounded-full"
        />
      </div>

      {/* Timer */}
      <span className="text-sm font-mono tabular-nums text-base-content/70 flex-shrink-0">
        {formatRecorderDate(milisec)}
      </span>

      {/* Send audio */}
      <button
        onClick={() => blb && uploadAudio(blb, selectedUser?._id?.toString(), user?._id?.toString() ?? "")}
        disabled={!recordUrl}
        className="btn btn-circle btn-sm bg-green-500 hover:bg-green-600 text-white
          disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
      >
        <SendHorizonal size={16} />
      </button>
    </div>

  ) : (
    /* Normal input row */
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
<textarea
  value={text}
  onChange={(e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }}
  rows={1}
  placeholder={t("placeholders.typeSomething", { ns: "common" })}
  className="input input-bordered rounded-lg input-sm text-sm placeholder:text-xs placeholder:text-base-content/30
  flex-1 min-w-0 resize-none overflow-hidden py-2 leading-5"/>

      {/* Image upload */}
      <label className="flex-shrink-0">
        <input ref={inputRef} onChange={handleUploadImage} type="file" accept="image/*" className="hidden" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`btn btn-sm btn-ghost btn-square
            ${image && imgPreview ? "text-green-500" : "text-base-content/60 hover:text-base-content"}`}
        >
          <Image size={18} />
        </button>
      </label>

      {/* Start recording */}
      <button
        type="button"
        onClick={() => { startRecording(); setShowAudio(true); setIsRunning(true); }}
        className="btn btn-sm btn-ghost btn-square text-base-content/60 hover:text-base-content flex-shrink-0"
      >
        <Mic size={18} />
      </button>

      {/* Send message */}
      <button
        type="submit"
        className="btn btn-sm btn-primary btn-square flex-shrink-0"
      >
        <Send size={18} />
      </button>

    </form>
  )}
</div>
    )
  }
  
  export default ChatInput
  