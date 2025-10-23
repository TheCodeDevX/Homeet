
 
 const SidebarSkeleton = () => {
   return (
     <div>
       {Array(20).fill("").map((_,i) => (
         <div key={i}
             className="bg-base-100 hover:bg-primary/10 p-4 flex flex-col">
              <div className="flex items-center gap-2">
                <div className="avatar relative">
                
                  <div className="size-12 w-full rounded-full">
                   <div className="w-full h-full skeleton"/>
                  </div>
                 
              </div>

             <div className="relative flex flex-col gap-2">
                <div className="w-20 h-5 rounded">
                    <div className="w-full h-full skeleton"></div>
                </div>

                <div className="w-10 h-3 rounded">
                    <div className="w-full h-full skeleton"></div>
                </div>
             </div>
              </div>
            </div>
       ))}
     </div>
   )
 }
 
 export default SidebarSkeleton
 