
 import clsx from 'clsx'
import { Calendar, Heart, MessageCircle, Star } from 'lucide-react'
import { memo, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import CloseButton from './CloseButton'
import { lightThemes } from '../constants'
import { useThemeStore } from '../store/themeStore'
import avatar from '../assets/avatar.png'
import { useListingStore, type Rating } from '../store/listingStore'
import { t } from 'i18next'
import { formatTime } from '../utils/formatTime'
import { useAuthStore } from '../store/auhStore'
import {motion} from 'framer-motion'
import TimeAgo from './TimeAgo'
import i18n from '../config/reacti18next'


interface CommentSectionProps {
  listingId:string
  isSidebarOpen : boolean
  setIsSidebarOpen : Dispatch<SetStateAction<boolean>>
  ratings : Rating[]
}

 const CommentSection = ({listingId, isSidebarOpen, setIsSidebarOpen, ratings} : CommentSectionProps) => {
    // const [isLiked, setIsLiked] = useState(false)
    // const [ratingId, setRatingId] = useState('')
    // const [likers, setLikers] = useState<string[]>([])
   
    const {theme} = useThemeStore();
    const { getRating, likeRating, isLoading, setIsAlreadyLiked, isAlreadyLiked} = useListingStore()
    const {user} = useAuthStore()
 

   const handleLikeRating = async(ratingId:Rating["_id"],
    ratingUserId:Pick<Exclude<Rating["user"], null>, "_id">["_id"], likers : Rating["likers"]) => {
    if(!ratingId || !ratingUserId || !listingId) return;
    // setRatingId(ratingId.toString())
    setIsAlreadyLiked(likers.includes(user?._id as string ?? false))
    console.log("isAlreadyLiked", isAlreadyLiked)
   try {
    await likeRating(ratingId.toString(), likers as string[]);
   } catch (error) {
    console.error(error)
   }
   }


    

    // useEffect(() => {
    // setIsLiked(likers.includes(user?._id as string))
    // }, [likers, user?._id])

  




 
   return (
 <motion.div 
  initial={{translateX:"-100%"}}
  animate={{translateX: isSidebarOpen ? "0%" : "-100%", transition: {duration:.5}}}
  className={clsx("fixed top-28 left-0 w-[400px] z-[40] h-full rounded bg-base-content text-base-300 p-4",
  "overflow-y-auto max-h-[calc(100%-7rem)]")}>
    <div className="flex items-center justify-between mb-2">
    <h1 className="flex items-center gap-2 text-lg">
    <MessageCircle size={20}/> {t("buttons.comments", {ns:"common"})}
    </h1>

    <CloseButton handleClose={() => setIsSidebarOpen(prev => !prev)}/>
    </div>
    { ratings.length === 0 ? <>
    No Comments Yet!
    </> : <div className='space-y-2'>
      { ratings.map((rating) => (
    <div key={rating._id?.toString()} className={clsx(!lightThemes.includes(theme) 
      ? "bg-white/50" 
      : "bg-black/25",
    "py-4 px-2")}>
     <div className="flex items-center justify-between gap-1.5">
       <div className="flex justify-center gap-2">
        <div className="size-11 bg-base-100 rounded-full overflow-hidden">
        <img src={rating.user?.profilePic || avatar} alt="profile picture" />
      </div>
     <div className="flex flex-col">
       <h1>{rating.user?.firstName}</h1>
       {/* {rating.updatedAt && } */}
       <TimeAgo time={rating.updatedAt as string} lang={i18n.language}/>
     </div>
       </div>
     <button disabled={isLoading} onClick={() => handleLikeRating(rating._id, rating.user?._id, rating.likers)}
      className={`text-xs cursor-pointer flex gap-1 items-center group`}>
      <p className="text-sm">{rating.likers?.length}</p>
      <Heart className={`${rating.likers?.includes(user?._id?.toString() as string)
       ? "fill-error" : "fill-transparent"}
         size-5 text-error hover:group-hover:fill-error transition-all`}/>
     </button>
     </div>
     {/* comment */}
     <div className=" mt-4">
      <p className="">
      "{rating.feedback}"
      </p>

      <div className='flex items-center justify-between gap-2 mt-2'>
      <div className='flex items-center gap-1'>
         <p className='flex items-center gap-0.5'>
         { rating.value && [...Array(5).fill("").map((_,i) => <Star size={15} className={`
        ${i <= (rating.value ?? 0) - 1 ? "fill-yellow-500" : "fill-transparent" } stroke-[1px] stroke-base-300`}
         key={i}/>)] }
       </p>
         <span className='text-md text-base-100/70 text-xs'>({t(`labels.stars${rating.value === 1 ? '_one' : '_other'}`, 
          {ns:"common", count:rating.value})})</span>
      </div>
      <div className="flex items-center gap-1 opacity-80 text-xs">
       <Calendar size={15}/> {rating.updatedAt?.split("T")[0]}
      </div>
      </div>
     
     </div>
    
    </div>  
    ))}
    </div>
    
  
    
    }
</motion.div>
   )
 }
 
 export default CommentSection
 