

 import React, { useEffect, useState } from 'react'
 
 
 const useToaster = () => {
     const [showMsg, setShowMsg] = useState<string | null>(null)
  const [queue, setQueue] = useState<string[]>([])

  const addMessage = (msg:string) => setQueue(q => [...q, msg]) 

  useEffect(() => {
   if(!queue) return;
   setShowMsg(queue[0])
   queue.slice(1)
    const timer = setTimeout(() => { setShowMsg(null) }, 2000);
     return () => clearTimeout(timer);
  }, [queue, showMsg])

  return {queue, showMsg, addMessage};
 }
 
 export default useToaster
 