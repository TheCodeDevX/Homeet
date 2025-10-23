import {motion} from 'framer-motion'
 
 const LoadingSpinner = () => {
   return (
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden ">
       <motion.div
      className='size-12 rounded-full border-4 border-base-content border-t-transparent  '
      animate={{rotate:360, transition: {duration:1, repeat:Infinity, ease:"linear"}}}/>
     </div>
   )
 }
 
 export default LoadingSpinner
 