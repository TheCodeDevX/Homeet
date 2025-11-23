import { ArrowLeft, BedDouble,  CheckIcon,  FolderOpen,  Loader2,  SendHorizonalIcon, Star, UserMinus, UserPlusIcon, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import avatar from "../assets/avatar.png"
import verificationIcon from '../assets/verificationIcon.svg'
import { ImLocation } from "react-icons/im"
import { amenities, currencies, prefixCurrencySymbols, type Facilities } from "../constants"
import { useListingStore, type RentalType } from "../store/listingStore"
import { useEffect, useRef, useState} from "react"
import { useParams } from "react-router-dom"
import Carousel from "../components/Carousel"
import LoadingSpinner from "../components/Spinner"
import { useTranslation } from "react-i18next"
import { useAuthStore, type UserData, type UserRole } from "../store/auhStore"
import i18n from "../config/reacti18next"
import { useMessageStore } from "../store/messageStore"
import { useFollowRequestStore } from "../store/followReqStore"
import { RiStarFill } from "react-icons/ri"
import UserProfile from "../components/UserProfile"
import FollowButton from "../components/FollowButton"
import {useMediaQuery} from "react-responsive"
import gsap from "gsap"
import {useGSAP} from "@gsap/react"
import ToolTip from "../components/ToolTip"







 

 const CardPage = () => {
  

   const {id} = useParams()
   const navigate = useNavigate()
   const {user} = useAuthStore()
   const lang = i18n.language
  const {getListing, isCardLoading, listing } = useListingStore()
  const [isFollowing, setIsFollowing] = useState(false)
  const {setSelectedUser} = useMessageStore()
  const container = useRef<HTMLDivElement>(null)
  const parent = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [toolTip, setToolTip] = useState("")
  const tl = useRef<gsap.core.Timeline>(null)
 const ctx = useRef<gsap.Context>(null)
 const isOpenRef = useRef(false);
 
  
  const {sendFollowReq,  isReqLoading, hasPendingFollowReq,
     setHasPendingFollowReq, getIncomingRequests, followReq} = useFollowRequestStore()
  useEffect(() => {
    if(id) {
      getListing(id)
    }
  }, [id])

  useEffect(() => {
     setIsFollowing((listing?.user?.followers?.includes(user?._id as string)) ?? false)
  }, [listing, id, user])


  const handleNavigation = () => {
    if(listing?.user){
      setSelectedUser(listing.user as UserData);
      navigate("/chat");
    }
  }

  const handleFollowReq = async(LisId:string) => {
    if(!LisId) return;
    try {
      await sendFollowReq(LisId);
      setIsFollowing(prev => !prev)
    } catch (error) {
      console.log(error)
    }
  }




  // const images = listing?.images.slice(0,3) ?? []

     const isPrefixCurrencySymbol = prefixCurrencySymbols.includes(listing?.user?.currency?.toUpperCase() as string)
  const amenitiesMap = Object.fromEntries(amenities.map(a => [a.label, a.icon]))

  const avgRating = listing?.avgRating

   const {t} = useTranslation()
       const facilities = t("card.facilities", {ns:"card", returnObjects:true}) as Record<string, Facilities>
       const roles = t("card.roles", {ns:"card", returnObjects:true}) as Record<string, UserRole>
       const categories = t("card.categories", {ns:"card", returnObjects:true}) as Record<string , RentalType>


    const Initialvars = {opacity:0, y:100, ease:"back.in", visibility:"visible"};

   useGSAP(() => {

     const elements = gsap.utils.toArray(container.current?.getElementsByTagName("button") as HTMLCollection)
      tl.current = gsap.timeline()
    ctx.current = gsap.context(() => {
    const {current} = tl; 
    if(isOpen){
    current?.to(container.current, Initialvars )
    .to(container.current, {visibility:"hidden"})
    } else {
     current?.fromTo(container.current, Initialvars, { opacity:1, y:0, visibility:"visible", ease:"back.out", duration:1})
      .fromTo(elements,
        {opacity:0, yPercent:100},
      {
      stagger:0.15,
      opacity:1,
      duration:0.3,
      yPercent:0,
      ease : "circ.inOut"
    }, "<")
    } 
     
    }, parent);
    return () => {
      ctx.current?.revert()
    };
   }, {dependencies:[isOpen], scope:parent});

 useEffect(() => {
  isOpenRef.current = isOpen;
 }, [isOpen])

   useEffect(() => { 
      const onClose =  (e: MouseEvent) => {
       if(parent.current?.contains(e.target as Node) || isOpenRef.current) return;
       setIsOpen(false)
       tl.current?.to(container.current, {autoAlpha:0})
     } 
     document.addEventListener("mousedown", onClose);
    return () => document.removeEventListener("mousedown", onClose)
   }, [])
   
  
   


   // Variables 
   const isMobile = useMediaQuery({maxWidth:640})
   const isCorrectUser = listing?.user?._id?.toString() !== user?._id?.toString() && listing?.user?._id
  
 
  if(isCardLoading) return <LoadingSpinner/>
   return (
     <div className="relative mt-24">
      <div className=" max-w-2xl w-full mx-auto space-y-0 lg:p-4 p-2">
       
  
          
        <div className="bg-base-300 border border-base-content/20 rounded-xl p-6 shadow-2xl space-y-4">
          <div>
            <button onClick={() => navigate(-1)}  className="flex items-center gap-2
             font-bold hover:text-white transition-colors duration-200">
            <ArrowLeft/> {t("buttons.goback", {ns:"common"})}
            </button>
          </div>
            
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
              
               <div ref={parent} className="relative h-fit w-fit ">
                 <div onClick={() => isMobile ? setIsOpen(prev => !prev) :
                  isCorrectUser && navigate(`/profile/${listing?.user?._id}`)} 
                className={`peer rounded-full flex items-center justify-center overflow-hidden border-2 border-primary/50
                ${isCorrectUser ? 
                "hover:border-primary hover:scale-95 transition-all duration-300 cursor-pointer"
                : "cursor-default"
              }`}>
                  <img className="size-20 object-cover" src={listing?.user?.profilePic || avatar}
                   alt={"Profile Picture"} />
                   
                    
                   
                </div>
                {isCorrectUser && <ToolTip/>}
             { isCorrectUser && isMobile &&
                <div id="card" ref={container} 
                className={`absolute ${lang === "ar" ? "right-full" : "left-full"} top-1/2
                 -translate-y-1/2 border border-primary/20 rounded-2xl opacity-0`}>
                  {/* Triangle */}
                  <div className={`absolute top-1/2  ${lang === "ar" ? "left-full rotate-180" : "right-full"} `}>
                   <div className="absolute top-1/2 -translate-y-1/2 border border-transparent">
                    <div className={`absolute top-1/2 -translate-y-1/2 
                    ${lang === "ar" ? "-right-3" : "-left-4"} h-0 w-0 z-20

                    border-l-[0px] border-l-transparent
                    border-r-[24px] border-r-base-100
                    border-b-[20px] border-b-transparent
                    border-t-[20px] border-t-transparent
                    `}>
                    </div>


                      <div className={`absolute top-1/2 -translate-y-1/2 
                       ${lang === "ar" ? "-right-[10px]" : "-left-[18px]"}  h-0 w-0 z-11
                    border-l-[0px] border-l-transparent
                    border-r-[24px] border-r-primary/20
                    border-b-[20px] border-b-transparent
                    border-t-[20px] border-t-transparent
                    `}>
                    </div>
                   </div>
                  </div>

                  <div className="card bg-base-100 shadow-xl overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between py-4 px-2">
                <UserProfile isBtn user={listing?.user as UserData | null}/>
                <div className="flex items-center justify-center max-md:flex-wrap gap-2">
                <FollowButton size="size-4" fontSize="text-xs "
                handleFollowReq={handleFollowReq}
                isFollowing={isFollowing} 
                isReqLoading={isReqLoading}
                handleNavigation={handleNavigation}
                />
                  </div>
                </div>
                </div>
            

                </div>}

               </div>
                
                <div>
                <div className="flex gap-1 items-center">
                   <h1 className="text-xl font-bold">{listing?.user?.firstName ?? "Anonymous"}</h1>
                  {listing?.user && <img className='pointer-events-none select-none'
                   src={verificationIcon} alt={listing?.user?.firstName || "userName"} />}
                </div>
                <p className="text-xs ">{roles[listing?.user?.role ?? "default"]}</p>
                </div>
              </div>
            { listing?.user?._id?.toString() !== user?._id?.toString() && <div className="flex gap-4 max-sm:hidden">
                
            <FollowButton handleNavigation={handleNavigation}
             handleFollowReq={handleFollowReq}
              isFollowing={isFollowing}
               isReqLoading={isReqLoading}/>
             
             </div>}
              </div>
            </div>
              <div className='flex gap-1 text-sm items-center'><ImLocation/>{listing?.location}</div>
              <div className='flex gap-1 lg:text-2xl font-semibold text-xl items-center'>{listing?.title}</div>

             <Carousel/>


              

              <div className='flex gap-1 lg:text-md text-sm items-center'>{listing?.description}</div>
              
                 <section className="flex flex-col">
                  <p className="flex gap-2 items-center font-bold text-xl mb-2">
                     {t("labels.amenities.text", {ns:"common"})} <BedDouble/></p>
                   <div className="flex flex-wrap gap-2">
                          {listing?.amenities?.map((amenity, index) => {
                           const Icon = amenitiesMap[amenity];
                            return (
                               <div key={index} className='flex items-center gap-2
                                  bg-base-200 border border-base-content/20 p-2 px-4 rounded-md
                                   hover:bg-base-100 select-none text-success '>
                                    {Icon && <Icon/>}
                                    {facilities[amenity]}
                                
                                </div>
                            )
                           
 })}
                          </div>
                 </section>

                 <div className="flex items-center justify-between">
                  <div className="">
                    <p className="sm:text-3xl text-xl font-black line-clamp-1">
                  <span className={`font-black`}>
                  {isPrefixCurrencySymbol && currencies.find(c => c.code.toLowerCase()
                   === listing?.user?.currency)?.symbol}
                  </span>
                  <span className={`font-black`}>{listing?.price}</span> 
                 <span className={`font-black mx-1`}>
                  {!isPrefixCurrencySymbol && currencies.find(c => c.code.toLowerCase()
                   === listing?.user?.currency)?.symbol}
                  </span>
                </p>
                      
                      </div>
                <div className='text-3xl font-bold flex items-center gap-1 '>
                  <RiStarFill className='text-yellow-500 flex' size={30}/> 
                  <p className="flex items-baseline gap-1">
                  {avgRating?.toString().includes(".") ? avgRating.toFixed(1) : avgRating} {" "}
                  <span className='text-xl text-base-content/50 relative -top-0.5'>(
                  {lang === "ar" && " "} {t("labels.reviews", {count: listing?.count, ns: "common"})} {lang !== "ar" && " "} )</span>
                  </p>
                </div> 
                 </div>
               
        </div>
      </div>
     </div>
   )
 }
 
 export default CardPage
 