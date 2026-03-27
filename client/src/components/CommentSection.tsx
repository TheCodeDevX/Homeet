
 import clsx from 'clsx'
import { Calendar, Heart, MessageCircle, Star } from 'lucide-react'
import {  type Dispatch, type SetStateAction } from 'react'
import CloseButton from './CloseButton'
import avatar from '../assets/avatar.png'
import { useListingStore, type Rating } from '../store/listingStore'
import { t } from 'i18next'
import { useAuthStore } from '../store/authStore'
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
   
    const { likeRating, isLoading, setIsAlreadyLiked, isAlreadyLiked} = useListingStore()
    const {user} = useAuthStore()
 

   const handleLikeRating = async(ratingId:Rating["_id"],
    ratingUserId:Pick<Exclude<Rating["user"], null>, "_id">["_id"], likers : Rating["likers"]) => {
    if(!ratingId || !ratingUserId || !listingId) return;
    // setRatingId(ratingId.toString())
    setIsAlreadyLiked(likers.includes(user?._id?.toString() as string ?? false))
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
  initial={{ x: "-100%" }}
  animate={{ x: isSidebarOpen ? "0%" : "-100%" }}
  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
  className={clsx(
    "fixed top-28 left-0 w-[380px] z-[1]",
    "h-[calc(100%-7rem)] flex flex-col",
    "bg-base-content text-base-300",
    "rounded-r-2xl shadow-2xl shadow-black/30"
  )}
>
  {/* Header */}
  <div className="flex items-center justify-between px-5 py-4 border-b border-base-300/10 shrink-0">
    <h2 className="flex items-center gap-2 font-semibold text-base tracking-wide">
      <MessageCircle size={18} className="opacity-70" />
      {t("buttons.comments", { ns: "common" })}
      {ratings.length > 0 && (
        <span className="text-xs font-normal opacity-50 ml-1">({ratings.length})</span>
      )}
    </h2>
    <CloseButton handleClose={() => setIsSidebarOpen(prev => !prev)} />
  </div>

  {/* Body */}
  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
    {ratings.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
        <MessageCircle size={36} strokeWidth={1} />
        <p className="text-sm">No comments yet</p>
      </div>
    ) : (
      ratings.map((rating, i) => (
        <motion.div
          key={rating._id?.toString()}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.25 }}
          className={clsx(
            "rounded-xl shadow-xl px-3.5 py-3",
            "bg-white/20 border border-white/20"
          )}
        >
          {/* Top row: avatar + name + like */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-full overflow-hidden ring-1 ring-base-300/20 shrink-0">
                <img
                  src={rating.user?.profilePic || avatar}
                  alt="profile picture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-medium">{rating.user?.firstName}</span>
                <TimeAgo date={rating.updatedAt as string} lang={i18n.language} />
              </div>
            </div>

            <button
              disabled={isLoading}
              onClick={() => handleLikeRating(rating._id, rating.user?._id, rating.likers)}
              className="flex items-center gap-1 group cursor-pointer"
            >
              <span className="text-xs opacity-60">{rating.likers?.length}</span>
              <Heart
                size={16}
                className={clsx(
                  "transition-all duration-200 text-error",
                  rating.likers?.includes(user?._id?.toString() as string)
                    ? "fill-error"
                    : "fill-transparent group-hover:fill-error/40"
                )}
              />
            </button>
          </div>

          {/* Feedback */}
          <p className="text-sm mt-3 leading-relaxed opacity-90 pl-0.5">
            "{rating.feedback}"
          </p>

          {/* Bottom row: stars + date */}
          <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-base-300/10">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {rating.value &&
                  [...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={clsx(
                        "stroke-[1.5px] stroke-base-300/60 transition-colors",
                        i <= (rating.value ?? 0) - 1 ? "fill-yellow-400" : "fill-transparent"
                      )}
                    />
                  ))}
              </div>
              <span className="text-xs opacity-50">
                ({t(`labels.stars${rating.value === 1 ? "_one" : "_other"}`, {
                  ns: "common",
                  count: rating.value,
                })})
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs opacity-40">
              <Calendar size={12} />
              {rating.updatedAt?.split("T")[0]}
            </div>
          </div>
        </motion.div>
      ))
    )}
  </div>
</motion.div>
   )
 }
 
 export default CommentSection
 