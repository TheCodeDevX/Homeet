
 import {motion} from 'framer-motion'
import { SendHorizontalIcon, Star, StarIcon, X } from 'lucide-react'
import { useEffect, useRef, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import { useListingStore } from '../store/listingStore';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


 
  const RatingModal = ({showModal, setShowModal, id} : {showModal : boolean,
     setShowModal : Dispatch<SetStateAction<boolean>>, id:string | undefined}) => {
 
    const [stars, setStars] = useState<number |undefined>(0);
    const [feedback, setFeedack] = useState<string | undefined>("")
    const {rateListing, rating, getRatings} = useListingStore()
    const ref = useRef<HTMLDivElement>(null)
    

    // useEffect(() => {
    // if(id){
    //    getRatings(id)
    // }
    // }, [rating])


    
    useEffect(() => {
      const closeModal = (e:KeyboardEvent) => {
        if(e.key === "Escape") setShowModal(false)
      }

      document.addEventListener("keydown", closeModal);
      return () => document.removeEventListener("keydown", closeModal)
    }, [])



    const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
     e.preventDefault();
   

     try {
      const data = {stars, feedback}
      if(id) {
        await rateListing(id, data)
       setShowModal(false)
      }
     } catch (error) {
      console.error(error)
     }
    }

    const {t} = useTranslation()
   return (
  
     <motion.div initial={{opacity:0}}
    animate={{opacity:showModal ?1:0, visibility:showModal?"visible":"hidden"}}
    transition={{duration:0.2, ease:"easeInOut"}}
     className='fixed inset-0 h-full bg-base-300/90 z-[9999999] text-center '>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div ref={ref}className="max-w-2xl mx-auto bg-base-content text-base-100 shadow-xl rounded-md  text-base-100 relative">
          <div className="p-6 space-y-4">
         <div className="flex items-center justify-center">
            <motion.div  
        initial={{scale:0}}
        animate={{scale:1, transition:{ type:"spring", damping:50, stiffness:500, delay:0.2, duration:1 }}}
        className='bg-gradient-to-b from-base-100 to-base-300 w-fit rounded-full p-4'
        >
        <StarIcon className='size-10 fill-yellow-500 stroke-yellow-500'/>
        </motion.div>
         </div>
           <h1 className='text-xl'>{t("ratingModal.q", {ns:"modals"})}</h1>
            <div className="flex items-center justify-center gap-2">
               {[1,2,3,4,5].map((star) => (
               <button key={star} onClick={() => setStars(star)} className=''><Star
                className={`${stars && stars >= star 
                  ? "fill-yellow-500 stroke-[1px] stroke-base-100/90" : "text-base-100/80 stroke-1"}`}
                   size={40}/></button>
           ))}
            </div>
            <div>
                <form onSubmit={handleSubmit} className=''>
                  
                 <input value={feedback}  onChange={(e) => setFeedack(e.target.value)} type="text"
                  placeholder={t("placeholders.feedback", {ns:"common"})}
            className='w-full bg-transparent border-b border-b-base-300 focus:outline-none p-2 placeholder-base-300/50
            ' />
            <button type='submit' className='btn btn-active w-full mt-4'>
              {t("buttons.submit", {ns:"common"})}
               <SendHorizontalIcon/></button>
           
              </form>
              <button type='button'
               className='btn btn-ghost w-full hover:bg-base-100/10 mt-2' onClick={() => 
               setShowModal(false)}>{t("buttons.refuse", {ns:"common"})}</button>
            </div>
          </div>
           <button type="button" onClick={() => setShowModal(false) } className='absolute right-1 top-1 p-2
            m-0 hover:bg-error rounded-full transition-colors duration-200'><X/></button>
        </div>
        </div>

     </motion.div>
 
   )
 }
 
 export default RatingModal;
 