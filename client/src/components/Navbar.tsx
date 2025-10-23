import { HomeIcon} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import avatar from '../assets/avatar.png'
import { iconButtons, languages, lightThemes, links, THEMES, type Links, type Tooltips } from '../constants'
import {motion} from 'framer-motion'
import React, { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useAuthStore } from '../store/auhStore'
import LogoutModal from './LogoutModal'
import clsx from 'clsx'
import { useThemeStore } from '../store/themeStore'
import { useTranslation } from 'react-i18next'
import i18n from '../config/reacti18next'
import { useLangStore } from '../store/languagesStore'
import LoadingSpinner from './Spinner'

 const Navbar = () => {
  const {user, logout} = useAuthStore()
  const [ready, setReady] = useState(false)
   const navigate = useNavigate()
  const location = useLocation();
   const [toolTip, setToolTip] = useState("");
   const [showLogout , setShowLogout] = useState(false)
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false)
  const [showThemesMenu, setShowThemesMenu] = useState(false);
  const [showLangsMenu, setShowLangsMenu] = useState(false)
   const [barStyle, setBarStyle] = useState<{
    width?: number;
    left?: number;
    opacity?: number;
  }>({width:0, left:0, opacity:1});

   const containerRef = useRef<HTMLUListElement | null>(null);

   const handleHover = (e:ReactMouseEvent<HTMLAnchorElement>) => {
    const containerRect = containerRef?.current?.getBoundingClientRect();
    const rect = e.currentTarget.getBoundingClientRect();
    if(!containerRect) return;
    setBarStyle({
      width:rect.width,
      left:rect.left - containerRect.left
    }) 
   };

   const resetBarToActiveLink = () => {
      const activeLink = containerRef.current?.querySelector(`.nav-item[data-path="${location.pathname}"]`)
      const containerRect = containerRef.current?.getBoundingClientRect()
      if(containerRect && activeLink) {
        const rect = activeLink.getBoundingClientRect();
        setBarStyle({width:rect.width, left:rect.left - containerRect.left, opacity:1})
      } else {
        setBarStyle({width:0, left:0, opacity:0})
      }
   }

   useEffect(() => {
   resetBarToActiveLink()
   }, [location.pathname])


   const handleToolTip = (msg:string) => {
   setToolTip(msg)
   }

  

   const handleLogout = async() => {
     try {
      await logout()
    } catch (error) {
      console.error(error);
    } finally {
       navigate("/login", {replace:true})
    }
   
   }

   const ref = useRef<HTMLDivElement>(null)
   useEffect(() => {
    const onClose = (e:MouseEvent) => {
      if(!ref.current?.contains(e.target as Node)) {
        // your click isn't inside the hamburger
        setShowHamburgerMenu(false)
        setShowThemesMenu(false)
        setShowLangsMenu(false)
      } 
    }
    document.addEventListener("mousedown", onClose)
    return () => document.removeEventListener("mousedown", onClose)
   },[])
   const handleClick = (action:"navigate" | "logout" | "changeTheme" | "changeLang" | undefined, e:React.MouseEvent) => {
    e.stopPropagation();


    if(action === "logout") {
    setShowLogout(prev => !prev)
    }  else if (action === "navigate") {
       setShowHamburgerMenu(prev => !prev)
       setShowThemesMenu(false)
       setShowLangsMenu(false)
    }  else if ( action === "changeTheme") {
      setShowThemesMenu(prev => !prev)
      setShowHamburgerMenu(false)
      setShowLangsMenu(false)
    }  else if (action === "changeLang") {
      setShowLangsMenu(prev => !prev)
      setShowHamburgerMenu(false);
      setShowThemesMenu(false)
    }
   }

   const { setTheme, theme:currTheme} = useThemeStore()
   const {setLang, lang:storedLang} = useLangStore()
  
  


  const {t} = useTranslation()
  const navLinks = t("links", {ns:"nav", returnObjects:true}) as Record<string , Links>

  const tooltips = t("tooltips", {ns : "tooltips", returnObjects:true}) as Record<string, Tooltips>
  const lang = i18n.language;

 
   return (
    <>
    {showLogout && <LogoutModal onLogout={handleLogout} onShowModal={setShowLogout}/>}
   <div className='fixed z-50 top-0 left-0 w-full h-24 flex items-center border-b border-base-content/10 backdrop-filter 
     backdrop-blur-xl'>
       <div className={`${ lang === "ar" ? "md:px-7 px-4" : "px-4"} min-w-full`}>
        <div className={` ${lang === "ar" ? "flex flex-row-reverse" : "flex" } items-center w-full`}>
          
          <div className={`flex items-center ${lang === "ar" ? "justify-end" : "justify-start"} w-full`}>
             {/* Logo */}
           <Link to='/' className={` ${lang === "ar" ? "flex flex-row-reverse" : "flex" } items-center justify-start gap-2 group`}>
            <HomeIcon className='max-xss:size-[1.2rem] size-8 text-base-content group-hover:text-base-content/80 transition-all duration-300'/>
            <span className='text-2xl text-base-content font-black uppercase relative top-px 
          group-hover:text-base-content/80
             transition-all duration-300 max-xss:text-[1.1rem]
            '>Homeet</span>
           </Link>
          </div>
       
        <div className='hidden xl:flex items-center justify-center w-full'>
           <ul onMouseLeave={resetBarToActiveLink} ref={containerRef}
            className={clsx("flex items-center space-x-10 px-8 py-4",
            "border border-base-content/10 bg-base-300 rounded-full relative overflow-hidden shadow",
            lang === "ar" && "flex-row-reverse"
   )}>
               <motion.span
                 animate={{width:barStyle.width,
                left : barStyle.left, opacity:barStyle.opacity}}
               transition={{duration:0.5, ease:"easeInOut"}}
                 className='absolute h-1 rounded-full bottom-0 bg-base-content' />
              {links.map(({href, size, key,icon:Icon, classes, id}) => (
                <Link onMouseEnter={(e) => { e.stopPropagation(),handleHover(e)}}
                data-path={href}
                 to={href}  key={id} className={clsx(classes, 
                location.pathname === href ? "text-base-content" : "text-base-content/50",
                user?.role === "tenant" && (key === "POST_LISTING" || key === "DASHBOARD") && "hidden",
                "nav-item")}>
                {navLinks[key]} 
                <Icon className={size}/>
                </Link>
              ))}
           </ul>
        </div> 

     

         <div className={`flex items-center ${lang === "ar" ? "justify-start" : "justify-end"} w-full`}>
           <div ref={ref} className={`flex   ${lang === "ar" ? "flex flex-row-reverse" : "flex" }
            items-center xl:space-x-3 space-x-1 relative `}>
            {iconButtons.map(({icon:Icon, iconClasses, classes, key, action }) => {
              const showTooltip = !(action === "navigate" && toolTip === "");
            return (
                <div key={key} className={clsx(lang === "ar" && "relative",  action !== "navigate" )}>

                  

                 {action === "navigate" &&  (
                <motion.div initial={{opacity:0, visibility:0}}
                 animate={{opacity:showHamburgerMenu?1:0, visibility:showHamburgerMenu?"visible":"hidden"
                }} 
              
                className={`_hamburger absolute top-full right-[33%]
               xl:hidden ${showHamburgerMenu ? "z-[200]" : "z-0"}`}>
                 <ul className='flex-wrap items-center 
              bg-base-300 rounded-xl flex
                border border-base-content/10 relative overflow-hidden p-4'>
               <motion.span className='absolute rounded-full bottom-0 bg-base-content' />

              {links.map(({href, size, key,icon:Icon, classes, id}) => (
                <Link
                data-path={href}
                 to={href}  key={id}
                className={clsx(classes,
                "p-2",
                location.pathname === href ? "text-base-content" : "text-base-content/60",
               user?.role === "tenant" && (key === "POST_LISTING" || key === "DASHBOARD") && "hidden",
               "nav-item")}>
                 {navLinks[key]}
                <Icon className={size}/>
                </Link>
              ))}
           </ul>

      
           </motion.div> 
                 )}
        
            <button 
             aria-label={tooltips[key]}
             key={key}
             className={clsx(`group relative ${classes} ${action === "navigate" && " flex xl:hidden"}`)} 
             onMouseEnter={() => !showHamburgerMenu && handleToolTip(tooltips[key])}
              onMouseLeave={() => setToolTip("")}
              onClick={(e) => {handleClick(action, e)}}
             >
               <div
                >
                {Icon ? <Icon className={`${iconClasses} max-xss:!size-4`}/> :  (
                  <div className='avatar flex items-center border-2 border-primary/50 hover:scale-[1.05]
                   rounded-full transition-all duration-200 hover:border-primary
                   overflow-hidden '>
                <Link to="/profile" className="size-8">
                <img className='' src={user?.profilePic || avatar}  alt="Avatar" rel="noreferrer"/>
                </Link>
                </div>)}
              </div>
          
               <span className={`
               ${ showTooltip && !showHamburgerMenu && !showThemesMenu && !showLangsMenu && toolTip.trim() !== ""
                 ? "group-hover:opacity-100 " : "opacity-0"} 
                absolute sm:block hidden opacity-0 -z-10 left-1/2 -translate-x-1/2
                top-full text-xs px-2 py-1 text-neutral-content border bg-neutral
                 border-neutral-content/10 rounded-lg whitespace-nowrap pointer-events-none`}>
                  {toolTip}</span>
             </button>
            {action === "changeTheme" && (
             <div
              className={`absolute right-[67%]
               ${showThemesMenu ? "z-[200]" : "z-0"}  `}>
                <motion.div initial={{display:"none"}}
                 animate={{ display:showThemesMenu?"block":"none"}}
                transition={{duration:0.2, ease:"easeInOut"}}
                className='overflow-y-auto w-40 h-[calc(54px*5)]  bg-base-300 rounded-xl
                border border-base-content/20 p-2'>
              
              {THEMES.map((theme) => (
                <button
                onClick={() => setTheme(theme.name)}
                key={theme.name}
                aria-label={theme.label}
                 className='p-2 w-full hover:bg-base-content/10 
                 rounded flex justify-start items-center gap-2'>
               
                   <div
                    className={`grid grid-cols-2 gap-0.5  p-2 rounded-xl border
                       border-base-content/20  bg-neutral/80 shadow-inner backdrop-filter backdrop-blur-xl
                    `}>
                     {theme.colors.map((color, index) => (
                    <span key={index} style={{backgroundColor:color}}
                    className={`w-2 h-2 rounded`}/>
                  ))}
                 
                  </div>
                <span className={`text-xs font-semibold ${ lightThemes.includes(currTheme)
                 ? "text-black"
                 : "text-white"
                  }`}>{theme.name}</span>
                </button>
              ))}
             </motion.div>
             </div>
             )}
        
          {action === "changeLang" && (
             <div 
            
             className={`absolute right-1/2 ${showLangsMenu ? "z-50" : "z-0"} `}>
               
                <motion.div initial={{display:"none"}}
                 animate={{ display:showLangsMenu?"block":"none"}}
                transition={{duration:0.2, ease:"easeInOut"}}
                className='overflow-y-auto w-40 h-fit bg-base-300 rounded-xl
                border border-base-content/20 p-2'>
              
              {languages.map(({language, symbol}) => (
                <button
                onClick={() => { i18n.changeLanguage(storedLang === symbol ? storedLang : symbol); 
                setLang(symbol) }}
                key={symbol}
                aria-label={language}
                //  onMouseEnter={() => setThemeToolTip(theme.label)}
                //  onMouseLeave={() => setThemeToolTip("")}
                 className={`p-2 w-full hover:bg-base-content/10
                   ${lightThemes.includes(currTheme) ? "active:bg-white" : "active:bg-black"}
                   ${ symbol === lang ? "bg-base-100/80" : "bg-transparent" }
                     relative flex justify-start items-center gap-4`}>
                  <span className='text-[10px] text-base-content/80'>{symbol.toUpperCase()}</span>
                 <span className='text-[14px] text-base-content'>{language}</span>
                </button>
              ))}
             </motion.div>
             </div>
             )}
             

             </div>
            )
             
 })}
            
           </div>
        </div> 
        </div>
          
       </div>
     </div></>)
   
 }
 
 export default Navbar
 