import verificationIcon from '../assets/verificationIcon.svg'
import house from '../assets/TinyHouse.svg'
import avatar from '../assets/avatar.png'
import { ImLocation } from 'react-icons/im'
import { ChevronLeft, ChevronRight, Heart, Image, Info } from 'lucide-react'
import {motion} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { RiStarFill } from 'react-icons/ri'
import { useListingStore, type ApiData } from '../store/listingStore'
import { amenities, currencies, lightThemes, prefixCurrencySymbols, type Facilities } from '../constants'
import { Link } from 'react-router-dom'
import useCarouselControls from '../hooks/useCarouselControls'
import { FaExclamation } from 'react-icons/fa'
import RatingModal from './RatingModal'
import { useTranslation } from 'react-i18next'
import { useAuthStore, type UserRole } from '../store/auhStore'
import i18n from '../config/reacti18next'
import e from 'cors'
import { useThemeStore } from '../store/themeStore'


 const Card = ({listing}: {listing : ApiData}) => {
  const {getRatings, isLoading} = useListingStore()
  const {user} = useAuthStore()
  
   
    const [isopen, setIsOpen] = useState(false)
    const [isHover, setIsHover] = useState(false)
     const [showModal, setShowModal] = useState(false)
     const imgRef = useRef<HTMLImageElement | null>(null)
    // const btnRef = useRef<HTMLAnchorElement>(null);

   
    const {state, dispatch} = useCarouselControls()

   

    // const handleClickInside = (e:React.MouseEvent<HTMLDivElement>) => {
    // if(btnRef.current?.contains(e.target as Node) &&  btnRef?.current.closest("._btn")) return;
    //   setIsOpen((prev) => !prev)
    // }
     const currentImage = listing?.images[state.currentIndex];

     const {theme} = useThemeStore()

     const {t} = useTranslation()
     const facilities = t("card.facilities", {ns:"card", returnObjects:true}) as Record<string, Facilities>
     const roles = t("card.roles", {ns:"card", returnObjects:true}) as Record<string, UserRole>
     const lang = i18n.language
     const avgRating = listing?.avgRating

     const isPrefixCurrencySymbol = prefixCurrencySymbols.includes(listing?.user?.currency?.toUpperCase() as string)
    
   return (
     <>
    
     <RatingModal id={listing._id} showModal={showModal} setShowModal={setShowModal}/>
     <div onMouseEnter={() => setIsHover(true)} 
     onMouseLeave={() => setIsHover(false)}
     className="card !flex-row gap-2 card-bordered border
      border-base-content/10 bg-base-300/50 shadow-lg overflow-hidden
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

{ (user?._id?.toString() !== listing.user?._id?.toString()) &&
         <button onClick={() =>setShowModal(prev => !prev)} className={`absolute z-40 top-1 
           ${!isopen ? "opacity-100" : "opacity-0 hidden"}
           ${lang == "ar" ? "right-1" : "left-1"}
           `}>
           <div className={`bg-base-300 
            p-2 group hover:bg-error hover:text-error-content transition duration-400
          rounded-full `}>
          <Heart className={`group-hover:fill-white group-hover:stroke-white
             stroke-base-content/80 transition-colors duration-300`}/>
           </div>
         </button>
     }

      <button onClick={() => {setIsOpen(p => !p)}}
       className={`bg-base-300 hover:bg-primary px-4 transition-colors duration-300
          cursor-pointer rounded-full absolute z-40 py-2 top-1 ${lang == "ar" ? "left-1" : "right-1"}
          hover:text-primary-content flex text-center 
          items-center gap-2 select-none `}>
          {isopen ? (<>  <Image/> {t("buttons.images", {ns:"common"})} </>) :
           (<> <Info/> {t("buttons.details", {ns:"common"})} </>)}
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
       {[...Array(listing.images.length)].fill("").map((_, i) => (
         <div key={i}>
          <p className={`text-9xl ${state.currentIndex === i ? "text-white" : "text-white/50"}`}>.</p>
         </div>
       ))}
      </div>
       </motion.div>

       <Link to={`/listings/${listing._id}`}>
           <motion.div initial={{x:"108%"}} animate={{ x:isopen ? "0%" : "108%"}}
          transition={{duration:0.5, type:"spring", damping:40, stiffness:150}}
        //  onClick={handleClickInside}
          className="cursor-pointer absolute inset-0 flex flex-col justify-center shadow-xl p-4
           sm:gap-y-2 md:gap-y-4 gap-y-4 max-xs:gap-y-1
           bg-neutral-content text-neutral rounded-xl overflow-hidden">
             <div className={`absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
               `}>
         </div>
             <section className="flex items-center gap-2 ">
                <div className='avatar '>
                  <div className="size-14 rounded-full border border-base-content/10 shadow-sm shadow-base-300/50">
                      <img src={listing.user?.profilePic ||  avatar} alt="" />
                  </div>
              
              </div>
             <header className="flex items-center w-full justify-between">
               <div >
              <figure className='flex items-center gap-1'>
                  <h2 className='xs:text-lg text-md font-bold truncate line-clamp-1'>
                    {listing?.user?.firstName ?? "Anonymous"}</h2>
                   {listing.user?.firstName && <img className='pointer-events-none select-none' src={verificationIcon} alt="" />}
              </figure>
                <p className='text-xs'>{roles[listing.user?.role ?? "default"]}</p>
              </div>

              {/* <Link ref={btnRef} className='max-sm:hidden _btn' to="/"><Button classes='flex items-center gap-2'>
                View Images <Image/> </Button></Link> */}
            

             </header>
             </section>
             <div className='flex gap-1 text-xs items-center'><ImLocation/>{listing.location}</div>

             <section className="flex justify-between">
                <h3 className='xs:text-xl text-md font-bold'>{listing.title.split(" ").slice(0,2).join(" ")}
                  { listing.title.split(" ").length > 2 && "..."}</h3>
                 <div className=''>
                <div className='text-lg font-bold flex items-center gap-1 '>
                <RiStarFill className='text-yellow-500 flex' size={18}/> 
                <p >
                  {avgRating?.toString().includes(".") ? avgRating.toFixed(1) : avgRating} {" "}
                   <span className='text-sm text-neutral/80'>({" "}
                    {lang === "ar" && " "} 
                    {t("labels.reviews", {ns: "common", count : listing.count })} {lang !== "ar" && " "} )</span>
                </p>
                  </div> 
               </div>
             </section>
             

             <section className="flex flex-col ">
                <span className="text-xs mb-2">{t("labels.description", {ns:"common"})}</span>
                <div className="bg-black/20 sm:p-2 p-1.5 rounded-xl">
                   <p className=' xs:text-sm text-xs line-clamp-1'>
                {listing.description}</p>
                </div>
             </section>

               <section className='flex flex-col'>
                <span className='text-xs'>{t("labels.price", {ns:"common"})}</span>
                <div className='mt-2 xs:text-lg tet-sm px-4 py-1 rounded-xl bg-black/10'>
                
                <p className={`line-clamp-1`}>
                  <span className={`font-black`}>
                  {isPrefixCurrencySymbol && currencies.find(c => c.code.toLowerCase()
                   === listing.user?.currency)?.symbol}
                  </span>
                  <span className={`font-black`}>{listing.price}</span> 
                 <span className={`font-black mx-1`}>
                  {!isPrefixCurrencySymbol && currencies.find(c => c.code.toLowerCase()
                   === listing.user?.currency)?.symbol}
                  </span>
                </p>
                </div> 
               </section>

             <section className="flex flex-col">
                <span className='text-xs mb-2'>{t("labels.amenities.text", {ns:"common"})}</span>
                <div className="flex gap-x-2 text-indigo-700">
                  {listing.amenities?.length === 0 ? (  <div className='p-2 bg-white/50 rounded-xl
                   flex gap-1 items-center whitespace-nowrap text-sm'><FaExclamation/>No amenities listed</div>) : 
                   (listing?.amenities?.slice(0,3).map((amenity, i) => (
                      <div key={i} className='xs:p-2 p-1.5 bg-white/50 border border-secondary/25
                      rounded-xl flex gap-1 items-center whitespace-nowrap
                       xs:text-sm text-xs'>
                        {amenities.map(({icon:Icon, label}) => 
                        ( amenity === label ? <Icon key={label} className='max-xs:size-5'/> : null ))}
                         {facilities[amenity]}
                         
                         </div>
                  )))}
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
 
 export default Card
 