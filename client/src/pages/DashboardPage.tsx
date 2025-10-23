import {motion} from 'framer-motion'
import {  Pen, Search, Trash } from 'lucide-react'
import { useListingStore } from '../store/listingStore'
import { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import fallbackImage from "../assets/image.png"
import FallbackCard from '../components/FallbackCard'
import { useTranslation } from 'react-i18next'
import i18n from '../config/reacti18next'

interface ListingType {
  title : string,
  description : string,
  location : string
  createdAt: string
}

 const DashboardPage = () => {
  const {t} = useTranslation()
  const {getUserListings, listings, deleteListing} = useListingStore()

   const [query , setQuery] = useState("")
  useEffect(() => {
    getUserListings()
  }, [])
  const navigate = useNavigate()
  const fields : (keyof ListingType)[] = ["title", "description", "location", "createdAt"]
  const filteredListings = listings.filter(listing => (
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
     className='input input-bordered w-full placeholder-base-content/80 pl-10'
    placeholder={t("placeholders.search", {ns:"common"})} />
    <Search className='absolute top-1/2 -translate-y-1/2 left-2 size-5 text-base-content/80'/>
     </div>
    {  filteredListings.length === 0 ?
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
        {filteredListings.length !== 0 &&  filteredListings.map((listing, index) => {
          const currentImage = listing?.images[0] ?? fallbackImage;
          return (
        
           <tr key={index}>
          <td>
             <img className="size-10 rounded-full" src={ currentImage} alt="image" />
          </td>
          <td>{listing.title}</td>
          <td className=''>{listing.description.split(" ").slice(0,10).join(" ")} 
            {listing.description.split(" ").length >= 10 && " ..."}</td>
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
        })}
       </tbody>
      </table>


  {filteredListings.length !== 0 &&  filteredListings.map((listing) => {
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
            <th>{t("dashboard.description", {ns:"dashboard"})}</th>
            <td className={`w-1/3 ${lang === "ar" ? "text-left" : "text-right"}`}>{listing.title}</td>
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
 )})}
      
    </div>
               )

               
    }
    
   
    
    </motion.div>
   )
 }
 
 export default DashboardPage
 