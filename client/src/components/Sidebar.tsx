import { useSidebarToggle } from '../hooks/useSidebarToggle';
import {motion,} from 'framer-motion'
import SidebarContent from './SidebarContent';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';


 const Sidebar = () => {

   const {isOpen, setIsOpen} = useSidebarToggle();
   const ref = useRef<HTMLAnchorElement>(null)
   const location = useLocation()

   useEffect(() => {
     const handleClickOutside = (e:MouseEvent) => {
      
    if(ref.current && !ref.current.contains(e.target as Node) && 
     !(e.target as HTMLElement).closest(".filter_")
    ) {
      setIsOpen(false)
    }
   }

   document.addEventListener("mousedown", handleClickOutside)
   return () => document.removeEventListener("mousedown", handleClickOutside)
    
   }, [])
   return (
   <>

   
      <aside
    className={`fixed z-[50] top-24 left-0 w-72 
    2xl:flex hidden flex-col border-r border-r-base-content/10
    h-[calc(100%-96px)] overflow-y-auto backdrop-filter backdrop-blur-3xl bg-base-content/5 `}>
       <SidebarContent/>
   </aside>


   {/* for smaller screens */}

   <motion.aside ref={ref} initial={{x:"-100%"}} animate={{x: isOpen ? "0%" : "-100%"}}
    transition={{duration:0.4, type:"spring", damping:40, stiffness:200}}
   className={`fixed z-[9999] top-24 left-0 w-72 border-r border-r-base-content/10
    2xl:hidden flex flex-col
    h-[calc(100%-96px)] overflow-y-auto backdrop-filter backdrop-blur-3xl bg-base-300 `}>
    <SidebarContent/>
      </motion.aside>

     </>
   )
 }
 
 export default Sidebar
 