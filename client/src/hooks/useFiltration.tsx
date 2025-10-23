import { FiltrationContext } from "../context/FilterProvider"
import { customContext } from "../utils/customContext"



  export const useFiltration = () => {
   return customContext(FiltrationContext, "useFiltration")
  }

 