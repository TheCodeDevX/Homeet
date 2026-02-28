import { FiltrationContext } from "../context/FilterProvider"
import { useCustomContext } from "../utils/useCustomContext"



  export const useFiltration = () => {
   return useCustomContext(FiltrationContext, "useFiltration")
  }

 