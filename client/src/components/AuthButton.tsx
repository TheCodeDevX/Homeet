
 import {motion} from 'framer-motion'
import type { ButtonHTMLAttributes, ComponentType, SVGProps } from 'react'

 interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ComponentType<SVGProps<SVGSVGElement>>
    provider: string
    googleAuth?:() => void
 }
 
 const AuthButton = ({icon:Icon, provider, googleAuth}: ButtonProps) => {
   return (
     <motion.button whileHover={{scale:1.05,
       transition:{ duration:0.5, type:"spring", damping:9}}}
      whileTap={{scale:0.98}} onClick={googleAuth} className='px-6 py-2 border border-base-content
        rounded-lg text-sm font-semibold shadow-lg text-base-content hover:bg-base-content hover:text-base-300
        flex items-center justify-center gap-4 w-full'>
            <Icon className='size-6'/>
           {provider}
     </motion.button>
   )
 }
 
 export default AuthButton
 