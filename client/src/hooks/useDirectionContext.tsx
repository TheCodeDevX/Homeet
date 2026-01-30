import { DirContext } from "../context/DirectionProvider"
import { customContext } from "../utils/customContext"

 
 export const useDirectionContext = () => {
    return customContext(DirContext, 'useDirContext');
 }
 
 