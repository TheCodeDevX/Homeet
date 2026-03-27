import { Search } from "lucide-react"
import { FaFilter, FaSort } from "react-icons/fa"
import { useSidebarToggle } from "../hooks/useSidebarToggle"
import { useEffect, useRef, useState } from "react";
import {motion} from 'framer-motion'
import { useFiltration } from "../hooks/useFiltration";
import { useTranslation } from "react-i18next";
import i18n from "../config/reacti18next";
import clsx from "clsx";

  const Searchbar = () => {

    const {handleSidebarOpen} = useSidebarToggle();
    const {handleFiltersChange, filters, setFilters, sort, onSortChange} = useFiltration()
    const [isOpen, setIsOpen] = useState(false);
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
     // eslint-disable-next-line react-hooks/exhaustive-deps
     // getListings is stable since it's a zustand store, no need to include
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
  
  
  const onSort = () => {
   setFilters(prev => ({...prev, shouldSort: prev.shouldSort || isNone ? false : true}))
   if(!filters.shouldSort) {
     setIsEmpty(isNone)
   }
  }

  // translations :
   const {t} = useTranslation()
   const lang = i18n.language
  
    return (
      <div ref={containerRef} className="mb-5 max-xs:mb-8 flex justify-between gap-2 select-none">
     <label className="relative w-full">
  <input
    onFocus={() => { setFocused(true); setIsOpen(false) }}
    onBlur={() => setFocused(false)}
    ref={focusRef}
    type="text"
    placeholder={t("placeholders.search", { ns: "common" })}
    name="query"
    value={filters.query}
    onChange={handleFiltersChange}
    className={`input input-bordered rounded-xl w-full text-sm
      ${lang === "ar" ? "pr-11" : "pl-11"}
      focus:outline-none focus:border-base-content/40
      placeholder:text-base-content/30`}
  />
  <Search className={`absolute top-1/2 -translate-y-1/2 size-4 text-base-content/40 pointer-events-none
    ${lang === "ar" ? "right-3.5" : "left-3.5"}`}
  />
</label>
     {filters.query.trim().length > 0 && <div className="2xl:hidden flex filter_">
       <motion.button transition={{duration:0}} animate={{display:focused? "none" : "flex"}}
         onClick={handleSidebarOpen}
          className={clsx("border border-base-content/20 base-outline-base-contentspace-nowrap",
         "items-center gap-2 bg-base-300/50 rounded right-0 px-4 shadow-sm",
          lang === "ar" && "flex-row-reverse",
          "hover:scale-105 transition-all duration-200 active:scale-95 text-base-content")}>
        <span className="max-xss:hidden"> {t("buttons.filter", {ns : "common"})} </span>
        <FaFilter/>
     </motion.button>
     </div>}

     { filters.query.trim().length === 0 && <div className="relative">
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
             <select value={sort.price}  defaultValue={"none"}
             onMouseDown={() => setIsEmpty(false)}
             name="price"
              onChange={onSortChange}
              className={`select ${isEmpty ? "select-error text-error" : "select-primary text-base-content"}
               select-sm bg-base-100  border duration-300 transition-colors ease-in-out`}>
              <option value="none">{t("default", {ns:"sort"})}</option>  
              <option value="cheap">{t("price.options.cheap", {ns:"sort"})}</option>
              <option value="expensive">{t("price.options.exp", {ns:"sort"})}</option>
             </select>
        </div>

         <div className="flex flex-col gap-2">
             <span>{t("rating.label", {ns:"sort"})}</span>
             <select value={sort.rating} 
             onMouseDown={() => setIsEmpty(false)}
             name="rating"
             onChange={onSortChange}
              className={`select ${isEmpty ? "select-error text-error" : "select-primary text-base-content"}
               select-sm bg-base-100 border duration-300 transition-colors ease-in-out`}>
              <option value="none">{t("default", {ns:"sort"})}</option>  
              <option value="high">{t("rating.options.high", {ns:"sort"})}</option>
              <option value="low">{t("rating.options.low", {ns:"sort"})}</option>
             </select>
        </div>

         <div className="flex flex-col gap-2">
             <span>{t("date.label", {ns:"sort"})}</span>
             <select name="date" value={sort.date} onChange={onSortChange}
              onMouseDown={() => setIsEmpty(false)}
              className={`select ${isEmpty ? "select-error text-error" : "select-primary text-base-content"}
               select-sm bg-base-100 border duration-300 transition-colors ease-in-out`}>
              <option value="">{t("default", {ns:"sort"})}</option>  
              <option value="old">{t("date.options.old", {ns:"sort"})}</option>
              <option value="new">{t("date.options.new", {ns:"sort"})}</option>
             </select>
        </div>
         <button className={`btn w-full ${filters.shouldSort ? "btn-error text-error-content" : "btn-primary text-primary-content"}`}
          onClick={onSort}>
            {filters.shouldSort ? t("cancel", {ns:"sort"}) : t("apply", {ns:"sort"})}
          </button>
         </div>
     </div>
     </div>}
    
      </div>
    )
  }
  
  export default Searchbar
  