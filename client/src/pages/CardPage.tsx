import { ArrowLeft, ArrowRight, Bath, Bed, BedDouble, BedSingleIcon, Building2, Heart, Info, Maximize2, MessageCircle, MessageSquare, Pin, Square } from "lucide-react"
import { useNavigate } from "react-router-dom"
import avatar from "../assets/avatar.png"
import verificationIcon from '../assets/verificationIcon.svg'
import { ImLocation } from "react-icons/im"
import { amenities, currencies, lightThemes, prefixCurrencySymbols, THEMES, type Facilities } from "../constants"
import { useListingStore } from "../store/listingStore"
import { useEffect, useRef, useState} from "react"
import { useParams } from "react-router-dom"
import Carousel from "../components/Carousel"
import LoadingSpinner from "../components/Spinner"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "../store/auhStore"
import * as types from "../../../backend/src/shared/types/types"
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
import flatpickr from 'flatpickr'
import "flatpickr/dist/flatpickr.css";
import FlatPickr, { type DateTimePickerHandle } from 'react-flatpickr'
import Button from "../components/Button"
import Price from "../components/Price"
import { useThemeStore } from "../store/themeStore"
import useBooking from "../hooks/useBooking"
import CardPageSkeleton from "../components/skeletons/CardPageSkeleton"
import useGsapAnimation from "../hooks/useGsapAnimation"
import DatePicker from "../components/DatePicker"
import clsx from "clsx"
import CloseButton from "../components/CloseButton"
import CommentSection from "../components/CommentSection"
import * as helpers from "../utils/helpers"
import { useBookingStore } from "../store/bookingStore"
// import useGsapAnimation from "../hooks/useGsapAnimation"







 

 const CardPage = () => {
  

   const {id} = useParams()
   const navigate = useNavigate()
   const {user} = useAuthStore()
   const lang = i18n.language
  const {getListing, isCardLoading, listing, ratings, getRatings } = useListingStore()
  const [isFollowing, setIsFollowing] = useState(false)
  const {setSelectedUser} = useMessageStore()
  const container = useRef<HTMLDivElement>(null)
  const parent = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
 const tl = useRef<gsap.core.Timeline>(null)
 const ctx = useRef<gsap.Context>(null)

  const timeline = useRef<gsap.core.Timeline>(null)
 const context = useRef<gsap.Context>(null);
 const isOpenRefTwo = useRef(false);
  const containerTwo = useRef<HTMLDivElement>(null)
  const parentTwo = useRef<HTMLDivElement>(null)

 const isOpenRef = useRef(false);
 const [isSidebarOpen, setIsSidebarOpen] = useState(false)
 const [isShow, setIsShow] = useState(false)
 const ref = useRef<HTMLDivElement>(null)
 
//  const dateRef = useRef<HTMLInputElement | null>(null);
 
 const {checkIn, checkOut, selectedDateRef, selectedDate, setSelectedDate} = useBooking();

//  const gsapAnimation = useGsapAnimation(container.current)

 
 const {theme} = useThemeStore()
  
  const {sendFollowReq,  isReqLoading} = useFollowRequestStore()
  useEffect(() => {
    if(id) {
      getListing(id)
    }
  }, [id])

  useEffect(() => {
     setIsFollowing((listing?.user?.followers?.includes(user?._id as string)) ?? false)
  }, [listing, id, user])

  useEffect(() => {
   if(id) {
   getRatings(id)
   }
    }, [id])


  // const handleNavigation = () => {
  //   if(listing?.user){
  //     setSelectedUser(listing.user as types.UserData);
  //     navigate("/chat");
  //   }
  // }







  // const images = listing?.images.slice(0,3) ?? []

 
  const amenitiesMap = Object.fromEntries(amenities.map(a => [a.label, a.icon]))

  const avgRating = listing?.avgRating

   const {t} = useTranslation()
       const facilities = t("card.facilities", {ns:"card", returnObjects:true}) as Record<string, Facilities>
       const roles = t("card.roles", {ns:"card", returnObjects:true}) as Record<string, types.UserRole>
      //  const categories = t("card.categories", {ns:"card", returnObjects:true}) as Record<string , pricingType>




    useGsapAnimation({containerRef:container, state:isOpen, isOpenRef,ctx, tl,
      parentRef:parent, withoutStagger:true});

      useEffect(() => { 
       const onClose =  (e: MouseEvent) => {
        if(parent.current?.contains(e.target as Node) || isOpenRef.current) return;
        setIsOpen(false);
        tl.current?.to(container.current, {autoAlpha:0})
      } 
      document.addEventListener("mousedown", onClose);
     return () => document.removeEventListener("mousedown", onClose)
    }, []);
    
    useGsapAnimation({
       containerRef:containerTwo,
       state:isShow,
       isOpenRef:isOpenRefTwo,
       ctx:context,
       tl:timeline,
       parentRef:parentTwo,
       withoutStagger : true,
      });




    


   // Variables 
   const isMobile = useMediaQuery({maxWidth:640})
   const isLargeScreen = useMediaQuery({minWidth:1520})
  
   // flatpickr
  // useEffect(() => {
  //   if(!dateRef.current) return;
  //   const instance = flatpickr(dateRef.current);
  //    console.log("instance", instance )
  // }, []);

  useEffect(() => {
    if(isLargeScreen || !isLargeScreen) {
      setIsShow(false)
    }
  }, [isLargeScreen])

  //  useEffect(() => {
  //       const onClose = (e: MouseEvent) => {
  //        if(!containerTwo.current?.contains(e.target as Node)) {
  //         setIsShow(false)
  //        }
  //       }
  
  //       document.addEventListener("mousedown", onClose)
  //       return () => document.removeEventListener("mousedown", onClose)
  // }, [])


  const isAllowedUser = user?._id?.toString() !== listing?.user?._id?.toString();
  const handleClick = () => setIsShow(prev => !prev);


 
  if(isCardLoading) {
    return <CardPageSkeleton/>
  } else document.body.style.overflow = 'auto'
   return (
    <>
{ isAllowedUser && !isLargeScreen &&
   
  <div ref={containerTwo} 
     className={clsx("fixed top-28 w-[400px] z-[99999] bg-base-300 p-4 rounded opacity-0 invisible",
       "left-1/2 -translate-x-1/2"
     )}
    >
     <DatePicker 
     listing={listing}
     checkIn={selectedDateRef.current.checkIn}
     checkOut={selectedDateRef.current.checkOut}
     selectedDateRef={selectedDateRef}
     handleClick={() => setIsShow(false)}
     selectedDate={selectedDate}
     setSelectedDate={setSelectedDate}
     />
     </div>
   
 }

 {id && <CommentSection
  ratings={ratings}
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
  listingId={id}/>}
     
     <div className={`relative mt-24`}>
       {/* Date Picker */}
   { isAllowedUser && isLargeScreen &&
     <div ref={containerTwo} 
     className={clsx("fixed top-28 w-[400px] z-[99999] bg-base-300 p-4 rounded opacity-0 invisible",
       "right-4"
     )}
    >
     <DatePicker 
      handleClick={() => setIsShow(false)}
      listing={listing}
      checkIn={selectedDateRef.current.checkIn}
      checkOut={selectedDateRef.current.checkOut} 
      selectedDateRef={selectedDateRef}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
     />
     </div>
 }

 {/* <div className="absolute max-sm:right-8 top-4">
  <button onClick={() => setIsSidebarOpen(true)}
   className="btn btn-primary">
    <ArrowRight/> <p className="flex items-center gap-2">Comment Section</p>
  </button>
 </div> */}

 

      <div className="max-w-2xl w-full mx-auto space-y-0 lg:p-4 p-2">
        <div className="bg-base-300 border border-base-content/20 rounded-xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)}  className="flex items-center gap-2
             font-bold hover:text-base-content/80 transition-colors duration-200">
            <ArrowLeft/> {t("buttons.goback", {ns:"common"})}
            </button>

           { ratings.length > 0 &&  <button onClick={() => setIsSidebarOpen(prev => !prev)}
             className={`flex items-center gap-2 font-semibold ${isSidebarOpen 
              ? "text-blue-400 hover:text-blue-400/80" 
              : "text-base-content hover:text-base-content/80"}
              transition-colors duration-200`}>
             {t("buttons.comments", {ns:"common"})} <MessageCircle size={18}/>
  
            </button>}
          </div>
            
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
              
               <div ref={parent} className="relative h-fit w-fit ">
                 <div onClick={() => isMobile ? setIsOpen(prev => !prev) :
                  isAllowedUser && navigate(`/profile/${listing?.user?._id}`)} 
                className={`peer rounded-full flex items-center justify-center overflow-hidden
                ${isAllowedUser ? 
                "hover:scale-95 transition-all duration-300 cursor-pointer"
                : "cursor-default"
              }`}>
                  <img className="size-20 object-cover" src={listing?.user?.profilePic || avatar}
                   alt={"Profile Picture"} />
                   
                    
                   
                </div>
                {isAllowedUser && <ToolTip/>}
             { isAllowedUser && isMobile &&
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
                  <div className="flex w-[200px] flex-wrap items-center justify-between py-4 px-2">
                <UserProfile isBtn user={listing?.user as types.UserData | null}/>
                <div className="flex items-center justify-center max-md:flex-wrap gap-2 mx-2">
                <FollowButton size="size-4" fontSize="text-xs"
                handleFollowReq={() => helpers.handleFollowReq({
                    recipientId:listing?.user?._id?.toString() as string,
                    userId: user?._id,
                    sendFollowReq, setIsFollowing})}
                isFollowing={isFollowing} 
                isReqLoading={isReqLoading}
                handleNavigation={
                  () => helpers.handleNavigation({
                  listingUser:listing?.user,
                  navigate,
                  setSelectedUser
                })
                }
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
                
            <FollowButton handleNavigation={
                  () => helpers.handleNavigation({
                  listingUser:listing?.user,
                  navigate,
                  setSelectedUser})
                }
              handleFollowReq={() => helpers.handleFollowReq({
                recipientId:listing?.user?._id?.toString() as string,
                userId: user?._id,
                sendFollowReq, setIsFollowing})}
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

                 <section className="flex flex-col">
                  <p className="flex gap-2 items-center font-bold text-xl mb-2">
                    {t("labels.specs.text", {ns:"common"})} <Info size={18}/></p>
                
                <div className="flex flex-wrap items-center gap-2">
                   <div  className='flex items-center gap-2
                                  bg-base-200 border border-base-content/20 p-2 px-4 rounded-md
                                   hover:bg-base-100 select-none text-base-content '>
                                   <Bed/> {t("labels.specs.beds", {ns:"common"})}:
                                    <strong className="text-base-content">
                                      {listing?.beds ?? 0}
                                    </strong>
                                
                   </div>

                    <div  className='flex items-center gap-2
                                  bg-base-200 border border-base-content/20 p-2 px-4 rounded-md
                                   hover:bg-base-100 select-none text-base-content '>
                                   <Building2/> {t("labels.specs.floors", {ns:"common"})}:
                                    <strong className="text-base-content">
                                       {listing?.floor ?? 0}
                                    </strong>
                                
                   </div>

                    <div  className='flex items-center gap-2
                                  bg-base-200 border border-base-content/20 p-2 px-4 rounded-md
                                   hover:bg-base-100 select-none text-base-content '>
                                   <BedSingleIcon/> {t("labels.specs.bedrooms", {ns:"common"})}:
                                    <strong className="text-base-content">
                                       {listing?.bedrooms ?? 0}
                                    </strong>
                                
                   </div>

                    <div  className='flex items-center gap-2
                                  bg-base-200 border border-base-content/20 p-2 px-4 rounded-md
                                   hover:bg-base-100 select-none text-base-content '>
                                   <Maximize2/> {t("labels.specs.size", {ns:"common"})}:
                                    <strong className="text-base-content">
                                       {listing?.size ?? 0}
                                    </strong>
                                
                   </div>

                    <div  className='flex items-center gap-2
                                  bg-base-200 border border-base-content/20 p-2 px-4 rounded-md
                                   hover:bg-base-100 select-none text-base-content '>
                                   <Bath/> {t("labels.specs.bathrooms", {ns:"common"})}:
                                    <strong className="text-base-content">
                                       {listing?.bathrooms ?? 0}
                                    </strong>
                                
                   </div>
                </div>

                                
                 </section>

                 <div className="flex items-center justify-between">
                  <Price listing={listing}/>
                  
                <div className='text-3xl font-bold flex items-center gap-1 '>
                  <RiStarFill className='text-yellow-500 flex' size={30}/> 
                  <p className="flex items-baseline gap-1">
                  {avgRating?.toString().includes(".") ? avgRating.toFixed(1) : avgRating} {" "}
                  <span className='text-xl text-base-content/50 relative -top-0.5'>(
                  {lang === "ar" && " "} {t("labels.reviews", 
                    {count: listing?.count, ns: "common"})} {lang !== "ar" && " "} )</span>
                  </p>
                </div> 
                 </div>

                { isAllowedUser &&
                    <Button classes="!py-3" onClick={handleClick}>
                    Reserve
                    </Button>  
                }
        </div>
      </div>
     </div>
     </>
   )
 }
 
 export default CardPage
 