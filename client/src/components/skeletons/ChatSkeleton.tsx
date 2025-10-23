 
 const ChatSkeleton = () => {
   return (
     <div className="p-4">
        { ...Array(9).fill("").map((_, i) => (
            <div className={`chat ${ i % 2 === 0 ? "chat-start" : "chat-end" } `}>
               
              
              <div className="avatar chat-image">
                <div className="size-10 rounded-full">
                    <div className="skeleton w-full h-full rounded-full"></div>
                </div>
              </div>



               <div className="chat-bubble w-32 h-16">
                    <div className="skeleton h-4 w-full"></div>
                
              </div>
      
            </div>
        )) }
     </div>
   )
 }
 
 export default ChatSkeleton
 