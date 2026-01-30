import {motion} from 'framer-motion'
import {  Loader, Pen, Search, Trash } from 'lucide-react'
import { useListingStore } from '../store/listingStore'
import { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import fallbackImage from "../assets/image.png"
import FallbackCard from '../components/FallbackCard'
import { useTranslation } from 'react-i18next'
import i18n from '../config/reacti18next'
import LoadingSpinner from '../components/Spinner'

interface ListingType {
  title : string,
  description : string,
  location : string
  createdAt: string
}

 const DashboardPage = () => {
  const {t} = useTranslation()
  const {getUserListings,userListings, deleteListing, isDashboardLoading} = useListingStore()

   const [query , setQuery] = useState("")
   const [isSliced, setIsSliced] = useState<{[id:string] : boolean}>({})
  useEffect(() => {
    getUserListings()
  }, [])
  const navigate = useNavigate()
  const fields : (keyof ListingType)[] = ["title", "description", "location", "createdAt"]
  const filteredListings =userListings.filter(listing => (
   fields.some(field => listing[field]?.toLowerCase().includes(query.toLowerCase().trim()))
  ))

  const lang = i18n.language

   return (
     <motion.div
    initial={{opacity:0, y:20}}
    animate={{y:0, opacity:1}}
    transition={{duration:0.5}} className="relative min-h-screen mt-24 p-2 sm:p-4 ">
    <div className="relative">
      <input value={query} onChange={(e) => setQuery(e.target.value) } type="text"
     className={`input input-bordered w-full placeholder-base-content/80 ${lang === 'ar' ? 'pr-10' : 'pl-10'}`}
    placeholder={t("placeholders.search", {ns:"common"})} />
    <Search className={`absolute top-1/2 -translate-y-1/2 
      ${lang === 'ar' ? "right-2" : "left-2"} mx-2 size-5 text-base-content/80`}/>
     </div>
    {  filteredListings.length === 0 && !isDashboardLoading ?
               <FallbackCard icon={query ? "search" : "info"} className='!mt-4'
               
              header={query  ? t("fallbackMessages.nothingFound", {ns:"messages"}) :
               t("fallbackMessages.noListingYet", {ns:"messages"})}
              subtext={query ? t("fallbackMessages.noListingMatchSearch", {ns:"messages"}) :
               t("fallbackMessages.plzPostListing", {ns:"messages"})}/>

               :

               (
                <div className="overflow-x-auto bg-base-300 rounded-xl shadow-sm
                 border border-base-content/20 mt-4">
      <table className='min-h-full text-left table max-sm:hidden  '>
        <thead className='bg-base-200 text-base-content lg:text-xl text-lg'>
          <tr>
            <th>{t("dashboard.image", {ns:"dashboard"})}</th>
              <th>{t("dashboard.title", {ns:"dashboard"})}</th>
               <th>{t("dashboard.description", {ns:"dashboard"})}</th>
              <th>{t("dashboard.location", {ns:"dashboard"})}</th>
              <th>{t("dashboard.createdAt", {ns:"dashboard"})}</th>
               <th>{t("dashboard.actions.title", {ns:"dashboard"})}</th>
          </tr>
        </thead>
       <tbody className='text-sm'>
        { (filteredListings.length !== 0) ?  filteredListings.map((listing, index) => {
          const currentImage = listing?.images[0] ?? fallbackImage;
          return (
        
           <tr key={index}>
          <td>
             <img className="size-10 rounded-full" src={ currentImage} alt="image" />
          </td>
          <td>{listing.title}</td>
          <td className='w-[250px]'>
           { !isSliced[listing._id as string] ? <div>
            {listing.description.split(" ").slice(0,5).join(" ")} 
            {listing.description.split(" ").length >= 5 && "..."} 
           { listing.description.split(" ").length >= 5  && <span className='text-indigo-500 cursor-pointer' onClick={() => setIsSliced(prev => 
           ({...prev, [listing._id as string] : !prev[listing._id as string] })) }>
            {t("buttons.readMore", {ns:"common"})}</span>}
            </div> :
             <div>{listing.description}
              { listing.description.split(" ").length >= 5 && <span className='text-indigo-500 cursor-pointer' onClick={() => setIsSliced(prev => 
           ({...prev, [listing._id as string] : !prev[listing._id as string] })) }> {t("buttons.less", {ns:"common"})}</span>}
             </div>
            }
            </td>
          <td>{listing.location}</td>
          <td>{listing.createdAt?.split("T")[0]}</td>
          <td className='md:space-x-2 space-y-2'>
            <button className='btn btn-xs' onClick={() => navigate(`/dashboard/${listing._id}`)}>
               <span className="flex items-center gap-2">
                {t("dashboard.actions.edit", {ns:"dashboard"})}
                 <Pen size={15}/></span>
            </button>
             <button onClick={() => deleteListing(listing._id ?? "") } className='btn btn-xs btn-error'>
             <span className="flex items-center gap-2">
              {t("dashboard.actions.delete", {ns:"dashboard"})}
               <Trash size={15}/></span>
            </button>
          </td>
        </tr>
         
        )
        }) : Array(2).fill("").map((_,i) => (
          <tr key={i} className='h-[63px]'>
            <td> 
             <span className='size-10 object-cover skeleton avatar bg-base-100/50 rounded-full'/>
            </td>

             <td> 
             <span className='h-3 w-1/2 object-cover skeleton flex bg-base-100/50 rounded-full'/>
            </td>

            <td> 
             <span className='h-3 w-full object-cover skeleton flex bg-base-100/50 rounded-full'/>
            </td>

             <td> 
             <span className='h-3 object-cover skeleton flex bg-base-100/50 rounded-full'/>
            </td>

             <td> 
             <span className='h-3 object-cover skeleton flex bg-base-100/50 rounded-full'/>
            </td>

              <td> 
              <div className="flex max-lg:flex-col items-center gap-2">
                <div className='h-6 w-[65px] flex skeleton bg-base-100/50'></div>
                <div className='h-6 w-[65px] flex skeleton bg-base-100/50'></div>
              </div>
            </td>
          </tr>
        ))}
       </tbody>
      </table>


  {(filteredListings.length !== 0 && !isDashboardLoading) ?  filteredListings.map((listing) => {
          const currentImage = listing?.images[0] ?? fallbackImage;
          return ( 
       <table key={listing._id} className={` min-h-full ${lang === "ar" ? "text-right" : "text-left"} table border-b sm:hidden `}>
      
          <tr>
            <th>{t("dashboard.image", {ns:"dashboard"})}</th>
            
            <td className='flex justify-end items-center'>
             <img className="size-10 rounded-full" src={ currentImage} alt="image" />
          </td> 
          </tr>

            <tr>
           <th>{t("dashboard.title", {ns:"dashboard"})}</th>
          <td className={`w-1/3 ${lang === "ar" ? "text-left" : "text-right"}`}>{listing.title}</td>
          </tr>

            <tr>
            <th className=''>{t("dashboard.description", {ns:"dashboard"})}</th>
            <td className={`w-1/2 ${lang === "ar" ? "text-left" : "text-right"}`}>
         
           { !isSliced[listing._id as string] ? <div>
            {listing.description.split(" ").slice(0,5).join(" ")} 
            {listing.description.split(" ").length >= 5 && "..."} 
           { listing.description.split(" ").length >= 5  && <span className='text-indigo-500 cursor-pointer' onClick={() => setIsSliced(prev => 
           ({...prev, [listing._id as string] : !prev[listing._id as string] })) }>{t("buttons.readMore", {ns:"common"})}</span>}
            </div> :
             <div>{listing.description}
              { listing.description.split(" ").length >= 5 && <span className='text-indigo-500 cursor-pointer' onClick={() => setIsSliced(prev => 
           ({...prev, [listing._id as string] : !prev[listing._id as string] })) }> {t("buttons.less", {ns:"common"})}</span>}
             </div>
            }
            </td>
           
          </tr>

            <tr>
             <th>{t("dashboard.location", {ns:"dashboard"})}</th>
             <td className={`w-1/3 ${lang === "ar" ? "text-left" : "text-right"}`}>{listing.location}</td> 
           </tr>

            <tr>
            <th>{t("dashboard.createdAt", {ns:"dashboard"})}</th>
             <td className={`w-1/3 ${lang === "ar" ? "text-left" : "text-right"}`}>{listing.createdAt?.split("T")[0]}</td>
           </tr>

            <tr>
           <th>{t("dashboard.actions.title", {ns:"dashboard"})}</th>
          <td className={`w-1/3 md:space-x-2 space-y-2 ${lang === "ar" ? "text-left" : "text-right"}`}>
            <button className='btn btn-xs' onClick={() => navigate(`/dashboard/${listing._id}`)}>
               <span className="flex items-center gap-2">
                {t("dashboard.actions.edit", {ns:"dashboard"})}
                 <Pen size={15}/></span>
            </button>
             <button onClick={() => deleteListing(listing._id ?? "") } className='btn btn-xs btn-error'>
             <span className="flex items-center gap-2">
              {t("dashboard.actions.delete", {ns:"dashboard"})}
               <Trash size={15}/></span>
            </button>
          </td>
          </tr>
       
       
      </table>
 )}) :  Array(3).fill("").map((_,i) => (
  <table key={i} className={` min-h-full table border-b sm:hidden `}>
      
          <tr>
            <th>
          <span className='h-3 w-[60px] object-cover skeleton flex bg-base-100/50 rounded-full'/>
            </th>
            
            <td className='flex justify-end items-center'>
               <span className='size-10 object-cover skeleton avatar bg-base-100/50 rounded-full'/>
          </td> 
          </tr>

            <tr>

            <th>
          <span className='h-3 w-[60px] object-cover skeleton flex bg-base-100/50 rounded-full'/>
          </th>
            <td className='flex justify-end items-center'>
             <span className='h-3 w-1/3 object-cover skeleton flex bg-base-100/50 rounded-full'/>
          </td> 
          </tr>

             <tr>

            <th>
          <span className='h-3 w-[60px] object-cover skeleton flex bg-base-100/50 rounded-full'/>
          </th>
            <td className='flex justify-end items-center'>
             <span className='h-3 w-1/3 object-cover skeleton flex bg-base-100/50 rounded-full'/>
          </td> 
          </tr>

            <tr>

            <th>
          <span className='h-3 w-[60px] object-cover skeleton flex bg-base-100/50 rounded-full'/>
          </th>
            <td className='flex justify-end items-center'>
             <span className='h-3 w-1/3 object-cover skeleton flex bg-base-100/50 rounded-full'/>
          </td> 
          </tr>

           <tr>

            <th>
          <span className='h-3 w-[60px] object-cover skeleton flex bg-base-100/50 rounded-full'/>
          </th>
            <td className='flex justify-end items-center'>
             <span className='h-3 w-1/3 object-cover skeleton flex bg-base-100/50 rounded-full'/>
          </td> 
          </tr>

            <tr>
         <th>
          <span className='h-3 w-[60px] object-cover skeleton flex bg-base-100/50 rounded-full'/>
            </th>
          <td className='flex justify-end gap-2 items-center gap-2"'> 
                <div className='h-6 w-[65px] flex skeleton bg-base-100/50'></div>
                <div className='h-6 w-[65px] flex skeleton bg-base-100/50'></div>
            </td>
          </tr>
       
       
      </table>
 ))
 
 }
      
    </div>
               )

               
    }
    
   
    
    </motion.div>
   )
 }
 
 export default DashboardPage
 