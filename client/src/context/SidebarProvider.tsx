import React, { createContext, useState, type PropsWithChildren, type SetStateAction } from "react"

 interface SidebarContextProps {
    isOpen : boolean
    handleSidebarOpen : () => void
    setIsOpen : React.Dispatch<SetStateAction<boolean>>
 }

 export const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);
 
 const SidebarProvider = ({children} : PropsWithChildren) => {
   const [isOpen , setIsOpen] = useState(false)
   const handleSidebarOpen = () => setIsOpen(prev => !prev);
   return (
    <SidebarContext.Provider value={{isOpen, handleSidebarOpen, setIsOpen}}>
     {children}
    </SidebarContext.Provider>
   )
 }
 
 export default SidebarProvider
 