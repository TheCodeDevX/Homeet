 import { type ReactNode } from 'react'
 import {motion} from 'framer-motion'
import { useThemeStore } from '../store/themeStore'
import { lightThemes } from '../constants';
 
 const Button = ({children, classes} : {children : ReactNode, classes?:string}) => {
  const {theme} = useThemeStore();
   return (
    <motion.button whileHover={{scale:1.02}} type="submit" whileTap={{scale:0.98}} className={`
      w-full px-5 py-2.5 bg-gradient-to-r from-10%
        hover:from-primary hover:to-secondary/80 from-primary to-secondary
        ${lightThemes.includes(theme)
         ? "hover:from-primary hover:to-secondary from-primary to-secondary"
        :"hover:from-primary hover:to-secondary from-primary/80 to-secondary/80"}
         text-md ring-offset-2 ring-offset-base-300 ring-2 ring-primary/50 hover:ring-primary
          font-semibold shadow-lg text-primary-content/80 rounded-lg transition-colors duration-200 mb-2 ${classes}`}>
          {children}
    </motion.button>
   )
 }
 
 export default Button
 