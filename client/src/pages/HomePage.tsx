
import { useEffect, useState } from "react"
import Card from "../components/Card"
import Searchbar from "../components/Searchbar"
import { useListingStore, type ApiData } from "../store/listingStore"
import { useFiltration } from "../hooks/useFiltration"
import usePagination from "../hooks/usePagination"
import FallbackCard from "../components/FallbackCard"
import {useTranslation} from 'react-i18next'
import CardSkeleton from "../components/skeletons/CardSkeleton"
import useDebounce from "../hooks/useDebounce"

 const HomePage = () => {

  
  const {filters, sort} = useFiltration()
   const {getListings, listings, isLoading, searchListings} = useListingStore()



 



     const debounced = useDebounce({...{filters}, sort}, 300)
    const {currentPage, setCurrentPage, pages, totalPages} = usePagination();
    const isNotFiltering = !(debounced?.filters.shouldFilter && debounced.filters.query)
    const isNotQuerying = !debounced?.filters.query
    useEffect(() => {
      if(!isNotFiltering) return;
      getListings()
    }, [currentPage, getListings, isNotQuerying, isNotFiltering])

   
    const isQuerying = debounced.filters.query.trim().length > 0
    const isSorting = debounced.filters.shouldSort

    useEffect(() => {
      if(!(debounced.filters.query || debounced.filters.shouldSort)) return;
        searchListings({
        ...(isSorting ? {} : {query:debounced.filters.query}),
        location : debounced.filters.location,
        shouldFilter:debounced.filters.shouldFilter, 
        maxPrice:debounced.filters.maxPrice,
        minPrice:debounced.filters.minPrice,
        amenities:debounced.filters.amenities,
        pricingType:debounced.filters.category,
        ...(isQuerying ? {} : {shouldSort:debounced.filters.shouldSort}),
        ...(isQuerying ? {} : {sort: debounced.sort})
      })
    }, [debounced.filters.shouldFilter, debounced.filters, isQuerying, isSorting, debounced.sort])

    const mappedListings = listings.map((listing : ApiData) => (
     <Card key={listing._id} listing={listing}/>
    ))

     // translations
     const {t} = useTranslation()


    const [isAlreadyClicked, setisAlreadyClicked] = useState(false)
    const handleClick = () => {
    if(isAlreadyClicked) return;
    setisAlreadyClicked(true);
    setCurrentPage(currentPage + 1)
    setTimeout(() => {setisAlreadyClicked(false)}, 2000)

    }

   console.log(mappedListings?.length, listings?.length)

   return (
     <div className="mt-24 max-sm:pt-2 ml-72 xl:p-4 lg:p-4 p-2 max-2xl:ml-0 select-none">
      <Searchbar/>
      <h1 className="md:text-3xl text-2xl font-black text-base-content mb-2.5 max-xs:4">

        {t("titles.header")}
        
        </h1>

      <p className="md:text-lg text-sm  font-semibold mb-5 max-xs:mb-8">

        {t("titles.subheader")}

        </p>
      
      { 
      
      
        listings?.length === 0 && !isLoading 
         ? <> <FallbackCard
          icon={"info"}
           header={t("fallbackMessages.noListingYet", {ns : "messages"})}
           subtext={t("fallbackMessages.nothingHereYet", {ns : "messages"})}
           /> </>
        
        :
        
        (mappedListings?.length === 0 && !isLoading)  ? <FallbackCard icon={"search"}
       header={`${filters &&
        t("fallbackMessages.nothingFound", {ns : "messages"})}`}
         subtext={`${filters &&
          t("fallbackMessages.noListingMatchSearch", {ns : "messages"})
        }`}/> : (
         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 ">
        { isLoading ? ( <>{Array.from({length : 6}).map((_, i) => (
        <CardSkeleton key={i}/>
      ))}</> ) : mappedListings}
     </div>
      )}
    { totalPages >= 2 && mappedListings?.length > 0 && listings?.length > 0 && <div className="flex justify-between items-center mt-4">
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
 