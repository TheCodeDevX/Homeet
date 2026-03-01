import { useState, type PropsWithChildren } from "react"
import { SidebarContext } from "./createdContexts/SidebarContext";
 
 export const SidebarProvider = ({children} : PropsWithChildren) => {
   const [isOpen , setIsOpen] = useState(false)
   const handleSidebarOpen = () => setIsOpen(prev => !prev);
   return (
    <SidebarContext.Provider value={{isOpen, handleSidebarOpen, setIsOpen}}>
     {children}
    </SidebarContext.Provider>
   )
 }
 
 