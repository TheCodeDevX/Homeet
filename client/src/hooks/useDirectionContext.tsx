import { DirContext } from "../context/DirectionProvider"
import { useCustomContext } from "../utils/useCustomContext"

 
 export const useDirectionContext = () => {
    return useCustomContext(DirContext, 'useDirContext');
 }
 
 