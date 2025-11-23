
 import React, { useState } from 'react'
 import {motion} from 'framer-motion'
import { links } from '../constants'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useAuthStore } from '../store/auhStore'
import type { BarStyleStates, NavLinks } from './Navbar'

 interface NavigatorProps {
    containerRef : React.RefObject<HTMLUListElement | null>
    resetBarToActiveLink : () => void;
    isShow : boolean
    barStyle : BarStyleStates
    handleHover :  (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
    barRef : React.RefObject<HTMLSpanElement | null>
    navLinks : NavLinks
 }
 
 const Navigator = ({containerRef, resetBarToActiveLink, isShow, barStyle, handleHover, barRef, navLinks} : NavigatorProps) => {
    const {user} = useAuthStore()

   return (
<div className='hidden xl:flex items-center justify-center w-full'>
    <ul  ref={containerRef}
    onMouseLeave={() => setTimeout(() => {
    resetBarToActiveLink()
    }, 100)}
    className={clsx("flex items-center gap-8 px-10 py-4 ",
        // lang === "ar" && "flex-row-reverse",
    "border border-base-content/10 bg-base-300 rounded-full relative overflow-hidden shadow",
    
)}>
    { !isShow &&
            <motion.span 
            animate={{
            left: barStyle.left,
        width:barStyle.width, opacity:barStyle.opacity}}
        transition={{duration:0.5, ease:"easeInOut"}}
            className='absolute h-1  bottom-0 rounded-full bg-base-content' />
    }
        
            
        
        {links.map(({href, size, key,icon:Icon, classes, id}) => (
        <Link
            onMouseEnter={(e) => { e.stopPropagation(),handleHover(e)}}
        //  onMouseLeave={(e) => handleMouseOut(e)}
            data-path={href}
            to={href}
            key={id}
            className={clsx(classes,
                "relative", 
        location.pathname === href ? "text-base-content" : "text-base-content/50",
        user?.role === "tenant" && (key === "POST_LISTING" || key === "DASHBOARD") && "hidden",
        "nav-item")}>
        {navLinks[key]} 
        <Icon className={size}/>
        
        {location.pathname === href && isShow && 
        <motion.span ref={barRef}
        className='absolute h-1 w-full rounded-full top-[150%] bg-base-content' />}
        </Link>
        ))}
    </ul>
</div> 
   )
 }
 
 export default Navigator
 