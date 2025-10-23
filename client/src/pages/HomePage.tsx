
import { memo, useEffect, useState } from "react"
import Card from "../components/Card"
import Searchbar from "../components/Searchbar"
import { useListingStore, type ApiData } from "../store/listingStore"
import type { FilterStates } from "../context/FilterProvider"
import { useFiltration } from "../hooks/useFiltration"
import usePagination from "../hooks/usePagination"
import FallbackCard from "../components/FallbackCard"
import {useTranslation} from 'react-i18next'
import CardSkeleton from "../components/skeletons/CardSkeleton"
import { useFollowRequestStore } from "../store/followReq"

 const HomePage = () => {

  
  const {filters, sort} = useFiltration()
   const {getListings, listings, isListingsLoading, isLoading, listingsLength} = useListingStore()



  const filteredListings = (data:ApiData[], filters:FilterStates) => {
    let filteredData = data;
    const q = filters.query.toLowerCase().trim()
    // if(!filters.query) return filteredData.map((listing : ApiData) => (<Card listing={listing}/>))

   if(filters.query){
      filteredData = filteredData.filter((listing) => (
       listing["title"].toLowerCase().includes(q) ||
        listing?.["description"].toLowerCase().includes(q) || 
        listing?.["location"].toLowerCase().includes(q) || 
        listing?.["rentalType"].toLowerCase().includes(q) || 
        listing?.["price"].toString().includes(filters.query) ||
        listing?.["amenities"]?.some(a => a.toLowerCase().includes(q))
      )
       )
   }

   if(filters.shouldSort) {
    if(sort.price === "cheap") {
     filteredData = filteredData.sort((a,b) => a.price - b.price)
    }else if(sort.price === "expensive") {
     filteredData = filteredData.sort((a,b) => b.price - a.price)
    } else {
     filteredData
    }
   }

  
  if(filters.shouldFilter){
    
    if(filters.category) {
       filteredData = filteredData.filter((listing) => (
        listing.rentalType.toLowerCase() === filters.category.toLowerCase()
       ))
    }

     if(filters.location){
      filteredData = filteredData.filter((listing) => (
        listing.location.toLowerCase().includes(filters.location)
      ))
   }

   if(filters.amenities) {
    filteredData = filteredData.filter((listing) => (
      filters.amenities?.every((a) => listing.amenities?.includes(a))
    ))
   }

   if(filters.maxPrice || filters.minPrice) {
    filteredData = filteredData.filter((listing) => (
      listing.price <= filters.maxPrice && listing.price >= filters.minPrice
    ))
   }
  }

  const MemorizedCard = memo(Card);
  
    return filteredData.map((listing : ApiData) => (
     <MemorizedCard key={listing._id} listing={listing}/>
    ))
  }



    
    const {currentPage, setCurrentPage, pages, totalPages} = usePagination();

    useEffect(() => {getListings()}, [currentPage])
    
    const filteredData = filteredListings(listings, filters)

     // translations
     const {t} = useTranslation()


 const [isAlreadyClicked, setisAlreadyClicked] = useState(false)
     const handleClick = () => {
      if(isAlreadyClicked) return;
      setisAlreadyClicked(true);
        setCurrentPage(currentPage + 1)
        setTimeout(() => {setisAlreadyClicked(false)}, 2000)
      
     }

   console.log(filteredData.length, listings.length)

   return (
     <div className="mt-24 max-sm:pt-2 ml-72 xl:p-4 lg:p-4 p-2 max-2xl:ml-0">
      <Searchbar/>
      <h1 className="md:text-3xl text-2xl font-black text-base-content mb-2.5 max-xs:4">

        {t("titles.header")}
        
        </h1>

      <p className="md:text-lg text-sm  font-semibold mb-5 max-xs:mb-8">

        {t("titles.subheader")}

        </p>
      
      { 
      
      
        listings.length === 0 && !isLoading 
         ? <> <FallbackCard
          icon={"info"}
           header={t("fallbackMessages.noListingYet", {ns : "messages"})}
           subtext={t("fallbackMessages.nothingHereYet", {ns : "messages"})}
           /> </>
        
        :
        
        (filteredData.length === 0 && !isLoading)  ? <FallbackCard icon={"search"}
       header={`${filters &&
        t("fallbackMessages.nothingFound", {ns : "messages"})}`}
         subtext={`${filters &&
          t("fallbackMessages.noListingMatchSearch", {ns : "messages"})
        }`}/> : (
         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 ">
        { isLoading ? ( <>{Array(3).fill("").map((_, i) => (
        <CardSkeleton key={i}/>
      ))}</> ) : filteredData}
     </div>
      )}
    { totalPages >= 2 &&  <div className="flex justify-between items-center mt-4">
        <button disabled={currentPage === 1} className="btn btn-active hover:btn-primary"
         onClick={() => setCurrentPage(currentPage -1)}>{t("buttons.previous", {ns: "common"})}</button>

        <div className="flex justify-center gap-2">
          {pages.map((page) => (
         <button key={page} onClick={() => setCurrentPage(page)}
         className={`btn rounded-full h-12 w-12
          ${currentPage === page ? "btn-primary" : "btn-active"}`}
          >{page}</button>
      ))}
        </div>

        

      <button disabled={currentPage === totalPages || isAlreadyClicked }
       onClick={handleClick}
       className="btn btn-active hover:btn-primary">{t("buttons.next", {ns: "common"})}</button>
    </div>}
     </div>
   )
 }
 
 export default HomePage
 