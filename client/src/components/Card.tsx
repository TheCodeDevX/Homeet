import verificationIcon from '../assets/verificationIcon.svg'
import house from "../assets/house.svg"
import avatar from '../assets/avatar.png'
import { ImLocation } from 'react-icons/im'
import { ChevronLeft, ChevronRight, Heart, Image, Info } from 'lucide-react'
import {motion} from 'framer-motion'
import {  useState } from 'react'
import { RiStarFill } from 'react-icons/ri'
import { useListingStore, type ApiData } from '../store/listingStore'
import { amenities, lightThemes, type Facilities } from '../constants'
import { Link } from 'react-router-dom'
import useCarouselControls from '../hooks/useCarouselControls'
import { FaExclamation } from 'react-icons/fa'
import RatingModal from './RatingModal'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'
import i18n from '../config/reacti18next'
import type { UserRole } from '../types/types'
import Price from './Price'
import clsx from 'clsx'
import { useThemeStore } from '../store/themeStore'


 const Card = ({listing}: {listing : ApiData}) => {
  const {isLoading} = useListingStore()
  const {user} = useAuthStore()
  
   
    const [isopen, setIsOpen] = useState(false)
    const [isHover, setIsHover] = useState(false)
     const [showModal, setShowModal] = useState(false)

   
    const {state, dispatch} = useCarouselControls()
    const {theme} = useThemeStore()

   

    // const handleClickInside = (e:React.MouseEvent<HTMLDivElement>) => {
    // if(btnRef.current?.contains(e.target as Node) &&  btnRef?.current.closest("._btn")) return;
    //   setIsOpen((prev) => !prev)
    // }
     const currentImage = listing?.images?.[state?.currentIndex];

     const {t} = useTranslation()
     const facilities = t("card.facilities", {ns:"card", returnObjects:true}) as Record<string, Facilities>
     const roles = t("card.roles", {ns:"card", returnObjects:true}) as Record<string, UserRole>
     const lang = i18n.language
     const avgRating = listing?.avgRating


   return (
     <>
    
     <RatingModal id={listing?._id} showModal={showModal} setShowModal={setShowModal}/>
   <div onMouseEnter={() => setIsHover(true)} 
     onMouseLeave={() => setIsHover(false)}
     className="card !flex-row gap-2 card-bordered border
      border-base-content/10 bg-base-200/60 shadow-lg overflow-hidden
     ">
        <div className="sm:p-2.5 p-4 w-full h-full overflow-hidden">
            <div className="relative">
               <figure className=' pointer-events-none select-none max-card-fix:h-[400px]
                max-[500px]:h-full sm:h-full max-xs:h-full
              md:max-w-sm md:mx-auto max-w-none min-w-full bg-base-100
              md:aspect-auto rounded-2xl overflow-hidden backdrop-blur-3xl'>
            
 
                 {isLoading ? 
                 (<div className='sm:h-[380px] skeleton max-xs:h-[300px] h-[400px]
                    w-full  object-cover max-md:object-fill'
                 />)
                 : (<img className={`sm:h-[380px] max-xs:h-[300px] h-[400px]
                    w-full object-cover object-center `}
              src={currentImage || house}  alt="Images"
              
              />)}
         </figure>
 
{ (user?._id?.toString() !== listing?.user?._id?.toString()) &&
         <button onClick={() => setShowModal(prev => !prev)} className={`cursor-pointer
           absolute z-40 top-2
           ${!isopen ? "opacity-100" : "opacity-0 hidden"}
           ${lang == "ar" ? "right-2" : "left-2"}
           `}>
           <div className={`bg-base-200
            p-2 group hover:bg-error hover:text-error-content transition duration-400
          rounded-full `}>
          <Heart className={`group-hover:fill-white group-hover:stroke-white
             stroke-base-content/80 transition-colors duration-300 size-[22px] max-xsss:size-[16px]`}/>
           </div>
         </button>
     }
 
      <button onClick={() => {setIsOpen(p => !p)}}
       className={`${lang == "ar" ? "left-2" : "right-2"}
          absolute z-40 top-2 btn !h-[39px] !min-h-[39px] bg-base-300 !text-[14px] font-normal
           rounded-full border border-base-content/5 hover:btn-active
           btn-md max-xsss:!btn-sm max-xs:!text-[11px] transition-colors duration-200`}>
          {isopen ? (<><Image className='size-[15px] max-xs:size-[14px] max-xsss:size-[13px]'/> {t("buttons.images", {ns:"common"})}</>) :
           (<> <Info className='size-[15px] max-xs:size-[14px] max-xsss:size-[13px]'/> {t("buttons.details", {ns:"common"})} </>)}
      </button>
    
     
         <motion.div initial={{opacity:0, visibility:"hidden"}}
       animate={{opacity: !isopen && isHover ? 1 : 0,
        visibility:isHover && listing.images.length -1 > 0 ? "visible" : "hidden"}}>
          <button onClick={(() => dispatch({type: "prev",length:listing.images.length}))}
       className={` bg-gradient-to-r from-zinc-500 to-zinc-300/50 
        shadow-[inset_-2px_-2px_10px_rgba(225,225,225,1)] transition-colors duration-300
          cursor-pointer rounded-full absolute z-50 p-2 top-1/2 left-1 
          -translate-y-1/2 text-white flex items-center gap-2 hover:from-zinc-600 hover:fto-zinc-400/50`}>
           <ChevronLeft/>
      </button>

      <button  onClick={(() => dispatch({type: "next", length:listing.images.length}))}
       className={`bg-gradient-to-l from-zinc-500 to-zinc-300/50 shadow-[inset_2px_2px_10px_rgba(225,225,225,1)]  transition-colors duration-300
          cursor-pointer rounded-full absolute z-50 p-2 top-1/2 right-1 
          -translate-y-1/2 text-white flex items-center gap-2 hover:from-zinc-600 hover:to-zinc-400/50`}>
           <ChevronRight/>
      </button>
      <div className='absolute bottom-0 flex items-center justify-center w-full select-none pointer-events-none'>
       { (listing.images.length < 6 ) ? [...Array(listing.images.length)].fill("").map((_, i) => (
         <div key={i}>
          <p className={`text-3xl mr-1 ${state.currentIndex === i ? "text-white" : "text-white/50"}`}>●</p>
         </div>
       )) : 
       <div className='text-lg font-semibold mb-1.5'>
        {`${state.currentIndex + 1}/${listing.images.length}`}
       </div>
       }
      </div>
       </motion.div>
 
       <Link to={`/listings/${listing._id}`}>
           <motion.div initial={{x:"100%"}} animate={{ x:isopen ? "0%" : "105%"}}
          transition={{duration:0.5, type:"spring", damping:30, stiffness:180}}
          className={clsx(
          "cursor-pointer absolute inset-0 flex flex-col justify-center shadow-xl p-3",
           "gap-y-4 max-xs:gap-y-2 max-card-fix:gap-y-[23px]",
          "rounded-xl overflow-hidden",
          lightThemes.includes(theme) 
          ? "bg-base-100 text-base-content" 
          : "bg-gradient-to-b from-base-300 to-base-200 border border-base-content/5 text-base-content"
          )}>
        
             <section className="flex items-center gap-2">
                <div className='avatar'>
                  <div className={
                    clsx("size-12 max-xs:size-11 max-xsss:size-10 rounded-full border-[2px] border-base-content shadow-sm shadow-base-300/50")
                  }>
                      <img src={listing?.user?.profilePic ||  avatar} alt="avatar" />
                  </div>
              
              </div>
                 <div className='flex flex-col'>
                    <div className='flex items-center gap-1'>
                      <span className="font-dmSerif text-[18px] max-xs:text-[16px] max-xsss:text-[15px] font-semibold truncate"
               >
                        {listing?.user?.firstName ?? "Anonymous"}
                      </span>
                      {listing.user?.firstName &&
                        <img src={verificationIcon} alt="verification icon" className='size-[18px] max-xsss:size-[15px]' />
                      }
                    </div>
                    <span className="badge max-xsss:!text-[9px] max-xs:badge-sm !text-[11.3px] !text-base-content
                     !bg-base-content/20 border border-base-content/30">{roles[listing?.user?.role ?? "none"]}
                     </span>
                  </div>
             </section>
 
             <section className="flex flex-col gap-1.5 justify-between">
               <div className='flex justify-between'>
               
                 <div className='flex gap-1 text-xs max-xs:text-[11px] max-xsss:text-[10px] items-center font-normal opacity-60'>
                   <ImLocation/>{listing?.location}
                 </div>
                 <div className='text-lg font-bold flex items-baseline gap-1'>
                   <RiStarFill className='text-yellow-500 relative top-[2px]' size={15}/> 
                   <p className='text-sm  max-xsss:text-xs'>
                     {avgRating?.toString().includes(".") ? avgRating.toFixed(1) : avgRating}
                   </p>  
                   <span className='text-xs max-xsss:text-[10px] font-normal opacity-50'>(
                     {t("labels.reviews", {ns: "common", count : listing.count })})
                   </span>
                 </div> 
               </div>
               <h3 className='xs:text-[21px] leading-[1.2] text-[16px] font-semibold font-dmSerif truncate'>
                 {listing.title}
               </h3>
             </section>
 
             <section className="flex flex-col">
                <span className="text-[11px] max-xsss:text-[9px] max-xs:text-[10px] mb-[4px] 
                uppercase opacity-50 tracking-[0.06rem]">
                  {t("labels.description", {ns:"common"})}
                </span>
                <div className="bg-base-content/5 border border-base-content/10 sm:py-[10px] sm:px-[12px] py-2 px-[10px] rounded-lg">
                   <p className='xs:text-sm text-xs line-clamp-1 opacity-75'>
                     {listing.description}
                   </p>
                </div>
             </section>
 
             <section className='flex flex-col'>
                <span className='text-[11px] max-xsss:text-[9px] max-xs:text-[10px] mb-[4px] uppercase opacity-50 tracking-[0.06rem]'>
                  {t("labels.price", {ns:"common"})}
                </span>
                <div className='bg-base-content/5 border border-base-content/10
                sm:py-[8px] sm:px-[10px] py-2 px-[10px] rounded-lg'>
                  <p className='line-clamp-1 font-semibold'>
                    <Price textSize="sm" isDynamic={false} listing={listing}/>
                  </p>
                </div> 
             </section>
 
             <section className="flex flex-col">
                <span className='text-[11px] max-xsss:text-[9px] max-xs:text-[10px] mb-[4px] uppercase opacity-50 tracking-[0.06rem]'>
                  {t("labels.amenities.text", {ns:"common"})}
                </span>
                <div className="flex gap-x-2">
                  {listing.amenities?.length === 0 
                  ? <div className='p-2 bg-base-content/8 border border-base-content/10 rounded-xl
                     flex gap-1 items-center whitespace-nowrap text-sm opacity-60'>
                      <FaExclamation/> No amenities listed
                    </div>
                  : listing?.amenities?.slice(0,3).map((amenity, i) => (
                      <div key={i} className='xs:px-3 xs:py-1.5 p-1.5 bg-base-content/10 border border-base-content/15
                      rounded-lg flex gap-1 items-center whitespace-nowrap text-xs font-semibold
                      '>
                        {amenities.map(({icon:Icon, label}) => 
                          amenity === label ? <Icon key={label} className='max-xs:size-4 size-6'/> : null
                        )}
                        {facilities[amenity]}
                      </div>
                  ))}
                </div>
              </section>
         
         </motion.div>
       </Link>
            </div>
        </div>
     </div>
     </>
   )
 }
 
 export default Card;
 


