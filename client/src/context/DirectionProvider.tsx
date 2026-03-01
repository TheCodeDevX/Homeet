import {useState, type PropsWithChildren } from "react"
import { DirContext } from "./createdContexts/DirContext";




 
 export const DirectionProvider = ({children} : PropsWithChildren) => {
    const [langDir, setLangDir] = useState('');
   return (
    <DirContext.Provider value={{langDir, setLangDir}}>
     {children}
    </DirContext.Provider>
   )
 }
 
