import { Search } from "lucide-react"
import { FaFilter, FaSort } from "react-icons/fa"
import { useSidebarToggle } from "../hooks/useSidebarToggle"
import { useEffect, useRef, useState } from "react";
import {motion} from 'framer-motion'
import { useFiltration } from "../hooks/useFiltration";
import { useListingStore } from "../store/listingStore";
import { useTranslation } from "react-i18next";
import i18n from "../config/reacti18next";
import clsx from "clsx";

  const Searchbar = () => {


    const {handleSidebarOpen} = useSidebarToggle();
    const {handleFiltersChange, filters} = useFiltration()
    const [isOpen, setIsOpen] = useState(false);
    const {getListings} = useListingStore()
    const {setFilters, sort, setSort} = useFiltration()
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isEmpty, setIsEmpty] = useState(false)
    useEffect(() => {
      function handleClickOutside(e:MouseEvent){
      if(containerRef.current && !containerRef.current.contains(e.target as Node)){
        setIsOpen(false)
      }
      };
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {getListings()}, [!filters.shouldSort])


   

   

    // handle focus & blur 
    const [focused, setFocused] = useState(false)
    const focusRef = useRef<HTMLInputElement>(null)
    // solution 2
  //  useEffect(() => {
  //   const checkFocus = () => {
  //   if(document.activeElement === focusRef.current) {
  //   setFocused(true)
  //   }else {
  //    setFocused(false)
  //   }
  //   }

  //   window.addEventListener("focusin" , checkFocus )
  //    window.addEventListener("focusout" , checkFocus )
  //    checkFocus()
  //   return () => {
  //      window.addEventListener("focusin" , checkFocus )
  //    window.addEventListener("focusout" , checkFocus )
  //   }
  //  }, [])

 const isNone = !sort.date && !sort.price && !sort.rating 
  
  
  const handleSorting = () => {
   setFilters(prev => ({...prev, shouldSort: prev.shouldSort || isNone ? false : true}))
   !filters.shouldSort && setIsEmpty(isNone); 
  }

  // translations :
   const {t} = useTranslation()
   const lang = i18n.language
  
    return (
      <div ref={containerRef} className="mb-5 max-xs:mb-8 flex justify-between gap-2 select-none">
     <label className="relative w-full">
         <input onFocus={() =>{setFocused(true), setIsOpen(false)}} onBlur={() => setFocused(false)} 
         ref={focusRef} type="text" placeholder={t("placeholders.search", {ns : "common"})} name="query"
         value={filters.query} onChange={handleFiltersChange}
           className={`input py-4 ${lang === "ar" ? "pr-16" : "pl-16"} max-sm:text-sm
         focus:outline-base-content focus:border-base-content w-full 
         placeholder-base-content outline-base-content/80 text-base-content
          border-b-base-content/50 shadow-sm rounded`} />
       <div className={`absolute z-20 ${lang === "ar" ? "right-8" : "left-8"}
         top-1/2 -translate-y-1/2 justify-center rounded`}> 
        <Search className="size-6"/></div>
         

     </label >
     <div className="2xl:hidden flex filter_">
       <motion.button transition={{duration:0}} animate={{display:focused? "none" : "flex"}}
         onClick={handleSidebarOpen}
          className={clsx("border border-base-content/20 base-outline-base-contentspace-nowrap",
         "items-center gap-2 bg-base-300/50 rounded right-0 px-4 shadow-sm",
          lang === "ar" && "flex-row-reverse",
          "hover:scale-105 transition-all duration-200 active:scale-95 text-base-content")}>
        <span className="max-xss:hidden"> {t("buttons.filter", {ns : "common"})} </span>
        <FaFilter/>
     </motion.button>
     </div>

      <div className="relative">
       <motion.button transition={{duration:0}} animate={{display:focused? "none" : "flex"}} 
       onClick={() => setIsOpen(prev => !prev)}
        className={clsx("border border-base-content/20 base-outline-base-contentspace-nowrap",
         "items-center gap-2 bg-base-300/50 rounded right-0 px-4 shadow-sm text-base-content",
         lang === "ar" && "flex-row-reverse",
          "hover:scale-105 transition-all duration-200 active:scale-95 h-full")}>
        <span className="max-xss:hidden"> {t("buttons.sort", {ns : "common"})} </span>
        <FaSort/>
     </motion.button>

     <div className={`absolute top-full mt-1  ${lang === "ar" ? " left-0" : "right-0"} overflow-hidden z-[60]
      rounded-xl backdrop-filter backdrop-blur-3xl`}>

        <div  className={`p-4  bg-base-300 border border-base-content/20 rounded-xl duration-150 linear space-y-6 
              ${isOpen ? "visible max-h-fit" : "max-h-0 border-0 z-0 overflow-hidden invisible py-0"}
            `}>
            
        <div className="flex flex-col gap-2">
             <span>{t("price.label", {ns:"sort"})}</span>
             <select value={sort.price} 
             onMouseDown={() => setIsEmpty(false)}
              onChange={(e) => setSort(prev => ({...prev, price:e.target.value}))}
              className={`select ${isEmpty ? "select-error text-error" : "select-primary text-base-content"}
               select-sm bg-base-100  border duration-300 transition-colors ease-in-out`}>
              <option value="">{t("default", {ns:"sort"})}</option>  
              <option value="cheap">{t("price.options.cheap", {ns:"sort"})}</option>
              <option value="expensive">{t("price.options.exp", {ns:"sort"})}</option>
             </select>
        </div>

         <div className="flex flex-col gap-2">
             <span>{t("rating.label", {ns:"sort"})}</span>
             <select value={sort.rating} 
             onMouseDown={() => setIsEmpty(false)}
             onChange={(e) => setSort(prev => ({...prev, rating:e.target.value}))}
              className={`select ${isEmpty ? "select-error text-error" : "select-primary text-base-content"}
               select-sm bg-base-100 border duration-300 transition-colors ease-in-out`}>
              <option value="">{t("default", {ns:"sort"})}</option>  
              <option value="high">{t("rating.options.high", {ns:"sort"})}</option>
              <option value="low">{t("rating.options.low", {ns:"sort"})}</option>
             </select>
        </div>

         <div className="flex flex-col gap-2">
             <span>{t("date.label", {ns:"sort"})}</span>
             <select value={sort.date} onChange={(e) => setSort((prev) => ({...prev, date : e.target.value}))}
              onMouseDown={() => setIsEmpty(false)}
              className={`select ${isEmpty ? "select-error text-error" : "select-primary text-base-content"}
               select-sm bg-base-100 border duration-300 transition-colors ease-in-out`}>
              <option value="">{t("default", {ns:"sort"})}</option>  
              <option value="old">{t("date.options.old", {ns:"sort"})}</option>
              <option value="new">{t("date.options.new", {ns:"sort"})}</option>
             </select>
        </div>
         <button className={`btn w-full ${filters.shouldSort ? "btn-error text-error-content" : "btn-primary text-primary-content"}`}
          onClick={handleSorting}>
            {filters.shouldSort ? t("cancel", {ns:"sort"}) : t("apply", {ns:"sort"})}
          </button>
         </div>
     </div>
     </div>
    
      </div>
    )
  }
  
  export default Searchbar
  