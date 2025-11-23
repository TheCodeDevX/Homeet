import { BrushCleaning, Filter} from 'lucide-react'
import avatar from '../assets/avatar.png'
import {ImLocation, ImPriceTag} from 'react-icons/im'
import { useLayoutEffect, useRef, useState, type ChangeEvent } from 'react'
import { TbCategory } from "react-icons/tb";
import { FaBed} from 'react-icons/fa';
import { amenities, type Facilities } from '../constants';
import { useAuthStore } from '../store/auhStore';
import { useFiltration } from '../hooks/useFiltration';
import { useTranslation } from 'react-i18next';
import i18n from '../config/reacti18next';
import clsx from 'clsx';
import UserProfile from './UserProfile';

const SidebarContent = () => {
  const rangeRef = useRef<HTMLInputElement | null>(null)
   const {filters, handleFiltersChange, clearAllFilters, setFilters} = useFiltration()
  

 const [active, setIsActive] = useState({
   price: false,
   category: false,
   location:false,
   amenities: false,
   sort : false
 })

 

 const handleToggle = (section: keyof typeof active) => {
  setIsActive(prev => ({...prev, [section] : !prev[section]}))
 }

 const handleMaxChange = (e:ChangeEvent<HTMLInputElement>) => {
  let {value, step} = e.target;
  

   if(+value <= filters.minPrice){
      setFilters(prev => ({...prev, maxPrice: filters.minPrice + Number(step)}))
   } else {
      setFilters(prev => ({...prev, maxPrice:+value}))
   }
 }

 const handleMinChange = (e:ChangeEvent<HTMLInputElement>) => {
  const{value, step} = e.target;
  
  if(+value >= filters.maxPrice ) {
   setFilters(prev => ({...prev, minPrice: ( filters.maxPrice - +step)}))
  } else {
   setFilters(prev => ({...prev, minPrice: +value}))
  }
 }
 const {user} = useAuthStore()



 const handleAmenitiesChange = (label:string, checked:boolean) => {
  if(checked){
   setFilters((prev) => ({...prev, amenities: [...prev.amenities, label]}))
  } else {
   setFilters((prev) => ({...prev, amenities:prev.amenities.filter((a) => a !== label)}))
  }
 } 


  const {t} = useTranslation();
  const facilities = t("content.filters.amenities.facilities",
    {ns:"sidebar", returnObjects:true}) as Record<string, Facilities>
   const lang = i18n.language;


  
  return (
    <>
       <div className="p-4 ">
         
     <div className='flex items-center justify-between '>
        <h2 className='text-xl font-bold '> {t("content.title", {ns: "sidebar"})} </h2>
      
     </div>

       <div className="space-y-3 mt-4">
          <button onClick={() => handleToggle("price")}
           className='cursor-pointer hover:text-base-content text-base-content/80 transition-all duration-200
           text-lg font-semibold flex items-center gap-2'><ImPriceTag size={18}/>
           {t("content.filters.price.name", {ns: "sidebar"})}
           </button>
      
          <div  className={`p-4 bg-base-300/50 rounded duration-150 ease-in-out
             ${active.price ? "visible max-h-fit" : "max-h-0 overflow-hidden invisible py-0"}`}>
        <div className="flex flex-col gap-4">
             <label className='flex flex-col gap-2'>
                <p className='text-center text-lg font-black p-2 border border-base-content/20 rounded-md m-2'>
                ${filters.minPrice} - ${filters.maxPrice}</p>
            <span className='label-text'>{t("content.filters.price.content.maxPrice", {ns: "sidebar"})}</span>
            {/* Max Range */}
            <input type="range" ref={rangeRef} className={clsx("range")}
             min={0} max={10000} step={1} value={filters.maxPrice} onChange={handleMaxChange} 
             />     
         </label>
         <label className='flex flex-col gap-2'>
            {/* Min Range */}
            <span className="label-text">{t("content.filters.price.content.minPrice", {ns: "sidebar"})}</span>
            <input type="range" className={`range range-primary`} value={filters.minPrice}
             onChange={handleMinChange}
             min={0} max={10000} step={1}  />
       </label>
        </div>
         </div>
       

         <button
          onClick={() => handleToggle("category")}
          className='cursor-pointer hover:text-base-content text-base-content/80 transition-all duration-200
           text-lg font-semibold flex items-center gap-2'><TbCategory/>
           {t("content.filters.category.name", {ns : "sidebar"})}
           </button>
        <div  className={`p-4 bg-base-300/50 rounded duration-150 ease-in-out
             ${active.category ? "visible max-h-fit" : "max-h-0 overflow-hidden invisible py-0"}`}>
        <div className="flex flex-col gap-4">
             <label className='flex flex-col gap-2'>
              <span className='label-text '> 
               {t("content.filters.category.content.label", {ns : "sidebar"})}
               </span>
              <select className='select select-bordered select-sm bg-base-300 text-base-content'
              value={filters.category} name='category' onChange={handleFiltersChange}>
               <option value="nightly" className='text-white'>
                   {t("content.filters.category.content.options.nightly", {ns : "sidebar"})}
               </option>
               <option value="monthly" className='text-white'>
                   {t("content.filters.category.content.options.monthly", {ns : "sidebar"})}
               </option>
                 <option value="forSale" className='text-white'>
                   {t("content.filters.category.content.options.forSale", {ns : "sidebar"})}
                 </option>
              </select>
         </label>
        
        </div>
         </div>
         <button onClick={() => handleToggle("location")} 
         className='cursor-pointer hover:text-base-content text-base-content/80 transition-all duration-200
           text-lg font-semibold flex items-center gap-2'><ImLocation/>
           {t("content.filters.location.name", {ns : "sidebar"})}
           </button>
        <div  className={`p-4 bg-base-300/50 rounded duration-150 ease-in-out
             ${active.location ? "visible max-h-fit" : "max-h-0 overflow-hidden invisible py-0"}`}>
            
        <div className="flex flex-col gap-4">
             <label className='flex flex-col gap-2'>
               <span className='label-text'>
                   {t("content.filters.location.name", {ns : "sidebar"})}
               </span>
             <input type="text" className='input input-sm input-bordered bg-base-300/50 text-base-content '  name='location'
             value={filters.location} onChange={handleFiltersChange}
              placeholder={t("content.filters.location.content.placeholder", {ns : "sidebar"})} />
            
         </label>
        
        </div>
         </div>

     <button onClick={() => handleToggle("amenities")}
         className='cursor-pointer hover:text-base-content text-base-content/80 transition-all duration-200
           text-lg font-semibold flex items-center gap-2'><FaBed/>
           {t("labels.amenities.text", {ns:"common"})}
           </button>

        <div  className={`p-4 bg-base-300/50 rounded duration-150 linear
             ${active.amenities ? "visible" : "max-h-0 overflow-hidden invisible py-0"}`}>
            
        <div className="flex flex-col gap-4">
             {amenities.map(({icon:Icon, label, key}, index) => (
               <label key={index} className='flex items-center justify-between gap-2
                bg-base-300 text-base-content/50 border border-base-content/10 p-2 px-4 rounded-md
                 hover:bg-base-content/5 '>
             <input type="checkbox" className='hidden peer' 
                checked={filters.amenities.includes(label)}
               onChange={(e) => handleAmenitiesChange(label, e.target.checked )}/>
              <span className='peer-checked:text-green-600'>
               { facilities[key] }
               </span>
              <Icon className='peer-checked:text-green-600'/>
              </label>
             ))}
        
        </div>
         </div>

        {filters.shouldFilter ? ( <button onClick={clearAllFilters} className=
        {clsx("btn w-full", lang === "ar" && "flex-row-reverse")}>
            {t("buttons.clearAll", {ns : "common"})}
            <BrushCleaning size={13}/>
         </button>)
         :( <button onClick={() => setFilters((prev) => ({...prev, shouldFilter:true}))} 
           className={clsx("btn w-full", lang === "ar" && "flex-row-reverse", "btn-primary")}>
             {t("buttons.filter", {ns : "common"})}
            <Filter size={13}/>
         </button>)}
          
        </div>
  </div>

 {/* User's Account & State */}
  <UserProfile user={user}/>
    </>
  )
}

export default SidebarContent
