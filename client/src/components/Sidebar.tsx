import { useSidebarToggle } from '../hooks/useSidebarToggle';
import {motion,} from 'framer-motion'
import { useEffect, useRef, type PropsWithChildren } from 'react';


 const Sidebar = ({children} : PropsWithChildren) => {

   const {isOpen, setIsOpen} = useSidebarToggle();
   const ref = useRef<HTMLAnchorElement>(null)

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
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []) // setIsOpen is stable, there's no need to include.
   return (
   <>

   
   <aside
    className={`fixed z-[50] top-24 left-0 w-72 
    2xl:flex hidden flex-col border-r border-r-base-content/10
    h-[calc(100%-96px)] overflow-y-auto backdrop-filter backdrop-blur-3xl bg-base-content/5 `}>
       {children}
   </aside>


   {/* for smaller screens */}

   <motion.aside ref={ref} initial={{x:"-100%"}} animate={{x: isOpen ? "0%" : "-100%"}}
    transition={{duration:0.4, type:"spring", damping:40, stiffness:200}}
   className={`fixed z-[9999] top-24 left-0 w-72 border-r border-r-base-content/10
    2xl:hidden flex flex-col
    h-[calc(100%-96px)] overflow-y-auto backdrop-filter backdrop-blur-3xl bg-base-300 `}>
    {children}
  </motion.aside>

     </>
   )
 }
 
 export default Sidebar
 