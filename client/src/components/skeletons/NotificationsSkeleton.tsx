
  
  const NotificationsSkeleton = () => {
    return (
     <div>
      <div className="relative">
          {[...Array(3).fill("").map((_,i) => (
            <div key={i} className="card border border-base-content/10 shadow-[0px_0px_30px_1px] shadow-primary/10
           bg-base-300
           flex items-center justify-center gap-4 p-8">
            <section className="flex items-center justify-between w-full gap-2 ">
                <div className="relative">
                  <div className='avatar '>
                  <div className="size-14
                  rounded-full border border-base-content/10 shadow-sm shadow-base-300/50">
                    <div className="skeleton  size-full bg-base-100 animate-pulse "/>
                  </div>
              
              </div>
            <p className='absolute top-1 right-4'>
                <span className='absolute inline-block size-2.5 bg-red-600 rounded-full animate-ping'/>
                 <span className='absolute inline-block size-2.5 bg-red-600 rounded-full'/>
            </p>
                </div>
             <header className="w-full flex flex-col gap-2 justify-start items-start">
            
             
                <figure className='flex items-center gap-1 '>
            
                    <span className="skeleton h-4 w-16 bg-base-100"/>  
              </figure>
              <span className="skeleton h-2.5 w-24 bg-base-100"/>
             </header>
            
       <div className="flex max-sm:flex-wrap items-center justify-end gap-2 w-full">
         <button className='sm:px-10 px-5 max-sm:w-full bg-base-100/80 skeleton rounded-lg
          h-12 w-32'/>

               <button className='sm:px-10 px-5 max-sm:w-full bg-base-100/20 skeleton rounded-lg
          h-12 w-32 border border-base-content/20'/>
       </div> 
             </section>
         </div>
          ))]}
          </div>
         </div>
    )
  }
  
  export default NotificationsSkeleton
  