import { useRef, useState } from "react"


 
 const useRecoder = () => {
    const [seconds, setSeconds] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordUrl, setRecordUrl] = useState<string | null>("");
    const mediaStream = useRef<MediaStream>(null)
    const mediaRecorder = useRef<MediaRecorder>(null)
    const chunks = useRef<Blob[]>([])
    const [isPlaying , setIsPlaying] = useState(false)
    const [blb, setBlb] = useState<Blob | null>(null)
      const [showAudio, setShowAudio] = useState(false);
       const [dur , setDur] = useState(0)
       const [isRunning, setIsRunning] = useState(false)
       const audioRef = useRef<HTMLAudioElement>(null)
       const [milisec, setMiliSec] = useState(0)
      

    const startRecording = async () => {
      try{
           setSeconds(0)
           setIsRecording(true);
           setIsPlaying(true)
           setRecordUrl(null)

        const stream = await navigator.mediaDevices.getUserMedia({audio:true});
        mediaStream.current = stream;

        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (e : BlobEvent) => {
         if(e.data.size < 0) return;
         chunks.current?.push(e.data)
        };
        const startedPoint = Date.now()
        const timer = setInterval(() =>{;
         const time =  Date.now() - startedPoint;
          setMiliSec( time )
      } ,1000)

        mediaRecorder.current.onstop = () => {
         const blob = new Blob(chunks.current, {type:"audio/webm"})
         const url = URL.createObjectURL(blob);
         setRecordUrl(url);
         setBlb(blob)
         clearInterval(timer)
        }
       mediaRecorder.current?.start()
      }
      catch(error) {
         console.error(error)
      }
     
    }

    const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder.current?.stop();
    mediaStream.current?.getTracks().forEach(t => t.stop())
    }

  
    function formatRecorderDate(fullMiliSeconds : number){
      const fullSeconds = +(fullMiliSeconds/1000).toString().split(".")[0]
      const hours = Math.floor(fullSeconds / 3600).toString();
      const minutes = Math.floor((fullSeconds % 3600) / 60 ).toString()
      const seconds = (fullSeconds % 60).toString()

      return `${hours.padStart(2,"0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2,"0")}`
    }

   return { startRecording, stopRecording, recordUrl, seconds, setSeconds, isRecording, formatRecorderDate
      , setIsPlaying, isPlaying, mediaRecorder, blb, showAudio, setShowAudio, dur, setDur, isRunning, setIsRunning, audioRef, chunks,
       mediaStream, setMiliSec, milisec
    }
 }
 
 export default useRecoder
 