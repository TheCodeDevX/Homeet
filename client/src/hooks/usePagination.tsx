import { useState } from "react";
import { useListingStore } from "../store/listingStore";

 
 const usePagination = () => {
         //  Pagination 
   const {currentPage, setCurrentPage, listingsLength, listings:Listings} = useListingStore()      
  const limit = 3;
  const totalPages = Math.ceil(listingsLength  / limit);


 const pagination = () => {
  let buttons = [] as number[];
  let startPage = Math.max(1, currentPage - 2 ) // -1. 0, 1 pages [1,2,3] will always show 1 as the start page
  let endPage = Math.min(totalPages, currentPage + 2) // so we'll never exceed the totalPages while adjusting which is perfect
  if(currentPage - 2 < 1) {
    // so this logic is applied only to the pages 1 & 2 , 3 is fine cuz if the 3 is the beginning that means
    // the end page will be 5 which is fine but for pages 1 & 2 there are some missed pages we want to adjust over here
    endPage = Math.min(totalPages, endPage + (3 - currentPage))
  }

  for (let page = startPage; page <= endPage; page++) {
    buttons.push(page)
    // page <= endPage assuming that endPage is 5 cuz you have 5 pages
    //  you use greator or equal to include 
    // the last page as well in this loop 
  }
  return buttons; // you return this array to consume it when you call this function;
 }


 const pages = pagination()

  return {currentPage, setCurrentPage , pages, totalPages, limit}
  
 }
 
 export default usePagination
 