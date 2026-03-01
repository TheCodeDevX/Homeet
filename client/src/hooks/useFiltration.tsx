import { FiltrationContext } from "../context/createdContexts/FiltrationContext"
import { useCustomContext } from "../utils/useCustomContext"



  export const useFiltration = () => {
   return useCustomContext(FiltrationContext, "useFiltration")
  }

 