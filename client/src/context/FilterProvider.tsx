import {  useState, type ChangeEvent, type PropsWithChildren, type SetStateAction } from "react";
import { FiltrationContext } from "./createdContexts/FiltrationContext";
import type { PricingType } from "../store/listingStore";

 export type FilterStates = {
    query: string,
    location : string 
    category : PricingType 
    amenities: string[] 
    minPrice: number 
    maxPrice : number
    shouldFilter : boolean
    shouldSort : boolean
  } 

  export type SortStates = {
    price?: "cheap" | "expensive" | "none";
    date?: "old" | "new" | "none";
    rating?: "low" | "high" | "none";
  }

 export interface FiltrationContextProps {
  filters : FilterStates
  setFilters : React.Dispatch<SetStateAction<FilterStates>>
  onSortChange : (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>)  => void
  sort : SortStates
  setSort : React.Dispatch<SetStateAction<SortStates>>
  handleFiltersChange :  (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>)  => void
  clearAllFilters : (clearQuery?:boolean) => void
 }


  export const FiltrationProvider = ({children} : PropsWithChildren) => {
 

    const [filters , setFilters] = useState<FilterStates>({
        query: "",
        location : "",
        category : "placeholder",
        amenities : [],
        minPrice: 0,
        maxPrice : 0,
        shouldFilter: false,
        shouldSort : false,
    })

    const [sort, setSort] = useState<SortStates>({
      price : "none",
      date : "none",
      rating : "none"
    })




    const handleFiltersChange = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
       
        setFilters(prev => ({...prev, [e.target.name]: e.target.value, shouldSort:false
        }))
    }

       const onSortChange = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSort({[e.target.name]: e.target.value})
    }

    
    

    const clearAllFilters = (clearQuery?:boolean) => {
        setFilters((state) => ({...state,
        shouldFilter: false,
        location : "",
        category : "placeholder",
        amenities : [],
        minPrice: 0,
        maxPrice : 0,
      ...(clearQuery ? {query : ""} : {})
      }));
    setSort({
      price : "none",
      date : "none",
      rating : "none"
    })
    }
    

    return (
     <FiltrationContext.Provider value={{
      filters,
      sort,
      setSort,
      setFilters,
      handleFiltersChange,
      onSortChange,
      clearAllFilters
     }}>
      {children}
     </FiltrationContext.Provider>
    )
  }

