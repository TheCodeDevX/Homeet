import { ArrowLeft, BedDouble,  FolderOpen,  Loader2,  SendHorizonalIcon, Star, UserMinus, UserPlusIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import avatar from "../assets/avatar.png"
import verificationIcon from '../assets/verificationIcon.svg'
import { ImLocation } from "react-icons/im"
import { amenities, currencies, prefixCurrencySymbols, type Facilities } from "../constants"
import { useListingStore, type RentalType } from "../store/listingStore"
import { use, useEffect, useState, type MouseEventHandler } from "react"
import { useParams } from "react-router-dom"
import Carousel from "../components/Carousel"
import LoadingSpinner from "../components/Spinner"
import { useTranslation } from "react-i18next"
import { useAuthStore, type UserData, type UserRole } from "../store/auhStore"
import i18n from "../config/reacti18next"
import { useMessageStore } from "../store/messageStore"
import { useFollowRequestStore } from "../store/followReq"
import { RiStarFill } from "react-icons/ri"
import UserProfile from "../components/UserProfile"
import FollowButton from "../components/FollowButton"



 

 const CardPage = () => {

   const {id} = useParams()
   const navigate = useNavigate()
   const {user} = useAuthStore()
   const lang = i18n.language
  const {getListing, isCardLoading, listing } = useListingStore()
  const [isFollowing, setIsFollowing] = useState(false)
  const {setSelectedUser} = useMessageStore()
 
  
  const {sendFollowReq,  isReqLoading, hasPendingFollowReq,
     setHasPendingFollowReq, getIncomingRequests, followReq} = useFollowRequestStore()
  useEffect(() => {
    if(id) {
      getListing(id)
    }
  }, [id])

  useEffect(() => {
     setIsFollowing((listing?.user?.followers?.includes(user?._id as string)) ?? false)
  }, [listing, id])


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
 
  if(isCardLoading) return <LoadingSpinner/>
   return (
     <div className=" relative mt-24">
      <div>
          <div className="relative max-w-xl">
            <div className="card border border-base-content/20 bg-neutral shadow-xl">
            <div className="p-4 flex items-center justify-between ">
                <UserProfile isBtn user={listing?.user as UserData | null}/>

                <div className="flex flex-wrap gap-2">
               <FollowButton size="size-4" fontSize="text-xs"
                handleFollowReq={handleFollowReq}
                 isFollowing={isFollowing} 
               isReqLoading={isReqLoading}
               handleNavigation={handleNavigation}
               />

          
                </div>
            </div>
            </div>
          </div>
      </div>
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
                <button className="rounded-full overflow-hidden border-2 border-primary/50">
                  <img className="size-20 object-cover" src={listing?.user?.profilePic || avatar} alt={"Profile Picture"} />
                 
                </button>
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
                               <div key={index} className='flex items-center gap-2 cursor-pointer
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
 