import { DirContext } from "../context/createdContexts/DirContext";
import { useCustomContext } from "../utils/useCustomContext"

 
 export const useDirectionContext = () => {
    return useCustomContext(DirContext, 'useDirContext');
 }
 
 