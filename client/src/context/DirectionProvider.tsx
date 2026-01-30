import React, { createContext, useState, type PropsWithChildren, type SetStateAction } from "react"


 interface DirStates {
    langDir : string,
    setLangDir : React.Dispatch<SetStateAction<string>>
 }


export const DirContext = createContext<DirStates | undefined>(undefined);
 
 export const DirectionProvider = ({children} : PropsWithChildren) => {
    const [langDir, setLangDir] = useState('');
   return (
    <DirContext.Provider value={{langDir, setLangDir}}>
     {children}
    </DirContext.Provider>
   )
 }
 
