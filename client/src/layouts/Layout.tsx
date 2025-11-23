import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import React from "react"
import SidebarProvider from "../context/SidebarProvider"
import { useLangStore } from "../store/languagesStore"
import i18n from "../config/reacti18next"

 interface LayoutProps {
    children : React.ReactNode
    showSidebar : boolean
 }
 
 const Layout = ({children, showSidebar } : LayoutProps) => {
  
   return (
    <SidebarProvider>
     <div className="h-full w-full ">
       <div className="flex">
        {showSidebar && <Sidebar/>}
        <div className="flex flex-1 flex-col">
            <Navbar/>
            <main className="flex-1">
                {children}
            </main>
        </div>
       </div>
     </div>
     </SidebarProvider>
   )
 }
 
 export default Layout
 