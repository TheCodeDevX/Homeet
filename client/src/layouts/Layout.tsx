import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import React from "react"
import { SidebarProvider } from "../context/SidebarProvider"
import SidebarContent from "../components/SidebarContent"
import { useLocation } from "react-router-dom"
import DashboardContent from "../components/DashboardContent"

 interface LayoutProps {
    children : React.ReactNode
    showSidebar : boolean
 }
 
 const Layout = ({children, showSidebar} : LayoutProps) => {
  const location = useLocation()
  
   return (
    <SidebarProvider>
     <div className="h-full w-full ">
       <div className="flex">
        {showSidebar && 
        <Sidebar>
        { location.pathname.startsWith("/dashboard")
        ? <DashboardContent/>
        : <SidebarContent/>
        }
        </Sidebar>}
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
 