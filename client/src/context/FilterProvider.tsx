import { createContext, useState, type ChangeEvent, type PropsWithChildren, type SetStateAction } from "react";

 export type FilterStates = {
    query: string,
    location : string 
    category : "nightly" | "monthly" | "forSale" 
    amenities: string[] 
    minPrice: number 
    maxPrice : number
    shouldFilter : boolean
     shouldSort : boolean
  } 

  type SortStates = {
    price: string;
    date: boolean;
    rating: boolean;
  }

 interface FiltrationContextProps {
  filters : FilterStates
  setFilters : React.Dispatch<SetStateAction<FilterStates>>
  sort : SortStates
  setSort : React.Dispatch<SetStateAction<SortStates>>
  handleFiltersChange :  (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>)  => void
  clearAllFilters : () => void
 }

export const FiltrationContext = createContext<FiltrationContextProps | undefined>(undefined);

  export const FiltrationProvider = ({children} : PropsWithChildren) => {
 

    const [filters , setFilters] = useState<FilterStates>({
        query: "",
        location : "",
        category : "nightly",
        amenities : [],
        minPrice: 0,
        maxPrice : 0,
        shouldFilter: false,
        shouldSort : false,
    })

    const [sort, setSort] = useState({
      price : "",
      date : false,
      rating : false
    })




    const handleFiltersChange = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({...prev, [e.target.name]: e.target.value
        
        }))
    }

    
    

    const clearAllFilters = () => {
        setFilters({
        query:"",
        shouldSort : false,
        shouldFilter: false,
        location : "",
        category : "nightly",
        amenities : [],
        minPrice: 0,
        maxPrice : 0
    });
    setSort({
      price : "",
      date : false,
      rating : false
    })
    }
    

    return (
     <FiltrationContext.Provider value={{
      filters,
      sort,
      setSort,
      setFilters,
      handleFiltersChange,
      clearAllFilters
     }}>
      {children}
     </FiltrationContext.Provider>
    )
  }

